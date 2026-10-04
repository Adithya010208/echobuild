/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Link, useRoute, useLocation } from 'wouter';
import {
  ProjectTemplate,
  ProjectWorkspace,
  MakerProfile,
  WorkspaceTask,
  TaskStatus,
  MentorshipRequest,
} from '../types';
import { calculateWorkspaceProjectMatch } from '../utils/workspaceMatching';
import { ComponentPassportModal } from '../components/inventory/ComponentPassportModal';
import {
  Layers,
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  MessageSquare,
  Wrench,
  Plus,
  Send,
  Trash2,
  ShieldCheck,
  AlertCircle,
  FileBadge2,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { FutureFeatureType } from '../components/common/FutureFeatureModal';

interface WorkspaceDetailPageProps {
  workspaces: ProjectWorkspace[];
  projects: ProjectTemplate[];
  allMakers: MakerProfile[];
  activeUser: MakerProfile;
  mentorRequests: MentorshipRequest[];
  onAddTask: (workspaceId: string, task: Omit<WorkspaceTask, 'id' | 'createdAt'>) => void;
  onUpdateTask: (workspaceId: string, task: WorkspaceTask) => void;
  onDeleteTask: (workspaceId: string, taskId: string) => void;
  onAddMessage: (workspaceId: string, message: { authorId: string; content: string }) => void;
  onCancelWorkspace: (workspaceId: string) => void;
  onOpenFutureFeature: (type: FutureFeatureType, projectName?: string) => void;
  onOpenMentorRequest: (projectId: string, workspaceId: string) => void;
}

export function WorkspaceDetailPage({
  workspaces,
  projects,
  allMakers,
  activeUser,
  mentorRequests,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddMessage,
  onCancelWorkspace,
  onOpenFutureFeature,
  onOpenMentorRequest,
}: WorkspaceDetailPageProps) {
  const [, params] = useRoute('/workspaces/:id');
  const [, setLocation] = useLocation();
  const workspaceId = params?.id;

  const workspace = useMemo(() => {
    return workspaces.find((w) => w.id === workspaceId);
  }, [workspaces, workspaceId]);

  const project = useMemo(() => {
    if (!workspace) return null;
    return projects.find((p) => p.id === workspace.projectId) || null;
  }, [workspace, projects]);

  const isMember = useMemo(() => {
    if (!workspace) return false;
    return workspace.memberIds.includes(activeUser.id);
  }, [workspace, activeUser]);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'components' | 'tasks' | 'discussion' | 'mentorship'
  >('overview');

  // New task form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(activeUser.id);

  // Discussion state
  const [newMessage, setNewMessage] = useState('');

  // Cancel workspace confirmation
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  // Passport preview
  const [passportItem, setPassportItem] = useState<any>(null);

  if (!workspace || !project) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 my-8">
        <h2 className="text-xl font-bold text-[#132B3B]">Workspace Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested collaboration workspace could not be found or has been archived.
        </p>
        <Link
          href="/network"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#087F83] bg-[#EAF4F3] rounded-lg hover:bg-[#087F83] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Maker Network</span>
        </Link>
      </div>
    );
  }

  // Calculate workspace requirements match, explicitly counting its own reservations!
  const workspaceMatch = calculateWorkspaceProjectMatch(project, workspace);

  // Linked mentorship requests
  const linkedMentorRequests = mentorRequests.filter(
    (r) => r.workspaceId === workspace.id || (r.projectId === project.id && workspace.memberIds.includes(r.requesterId))
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask(workspace.id, {
      workspaceId: workspace.id,
      title: taskTitle.trim(),
      description: taskDesc.trim() || undefined,
      assigneeId: taskAssignee,
      status: 'todo',
    });

    setTaskTitle('');
    setTaskDesc('');
    setIsAddingTask(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onAddMessage(workspace.id, {
      authorId: activeUser.id,
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  const members = workspace.memberIds.map(
    (id) => allMakers.find((m) => m.id === id) || { id, displayName: id }
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/network"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#087F83] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Maker Network</span>
        </Link>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-md ${
              workspace.status === 'active'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {workspace.status === 'active' ? 'Active Collaboration' : 'Archived / Cancelled'}
          </span>

          {isMember && workspace.status === 'active' && (
            <button
              onClick={() => setIsConfirmingCancel(true)}
              className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Release & Cancel Collaboration
            </button>
          )}
        </div>
      </div>

      {/* Non-member restricted view alert */}
      {!isMember && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Restricted View (Observer Mode):</span>
            <p>
              You are currently viewing this workspace as{' '}
              <strong>{activeUser.displayName}</strong>. Only workspace members (
              {members.map((m) => m.displayName).join(', ')}) can add tasks, post
              messages, or change statuses. Switch users via the Demo User Switcher
              in the top bar to collaborate as a member.
            </p>
          </div>
        </div>
      )}

      {/* Workspace Header Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.difficulty} Level</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {project.estimatedDuration} est.
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#132B3B]">
              {project.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {project.purpose}
            </p>
          </div>

          {/* Team Members List */}
          <div className="p-4 bg-[#F7F9F8] rounded-xl border border-slate-200 space-y-2 shrink-0 sm:min-w-[240px]">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Users className="w-3.5 h-3.5 text-[#087F83]" />
              <span>Project Team</span>
            </div>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="text-xs">
                  <div className="font-bold text-[#132B3B] flex items-center justify-between">
                    <span>{member.displayName}</span>
                    {member.id === activeUser.id && (
                      <span className="text-[10px] text-[#087F83] font-normal">
                        (Active User)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    {workspace.memberRoles[member.id] || 'Team Collaborator'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coverage Progress Bar (Counts Workspace's Own Reservations!) */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Workspace Requirement Coverage (Reserved Contributions)
            </span>
            <span className="font-mono font-bold text-base text-[#132B3B] tabular-nums">
              {workspaceMatch.coveragePercentage}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                workspaceMatch.isFullyCovered
                  ? 'bg-emerald-500'
                  : 'bg-[#087F83]'
              }`}
              style={{ width: `${workspaceMatch.coveragePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>
              {workspaceMatch.matchedReservedUnits} of {workspaceMatch.totalRequiredUnits} units reserved and secured for this build
            </span>
            {workspaceMatch.potentialReuseMassGrams > 0 && (
              <span className="font-mono">
                ~{workspaceMatch.potentialReuseMassGrams}g allocated hardware mass
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-0.5">
        {[
          { id: 'overview', label: 'Overview & Steps' },
          { id: 'components', label: `Components (${workspace.reservations.length} Reserved)` },
          { id: 'tasks', label: `Tasks (${workspace.tasks.length})` },
          { id: 'discussion', label: `Discussion (${workspace.messages.length})` },
          { id: 'mentorship', label: `Mentorship (${linkedMentorRequests.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-[#087F83] border-t-2 border-[#087F83] border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High level build overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-[#132B3B] uppercase tracking-wider">
                High-Level Build Steps
              </h2>
              <ol className="space-y-2.5 text-xs text-slate-700">
                {project.highLevelOverview.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#087F83] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Supplies to confirm & Learning outcomes */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h2 className="text-sm font-bold text-[#132B3B] uppercase tracking-wider">
                  Mechanical Supplies to Confirm
                </h2>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {project.mechanicalSupplies.map((sup, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087F83] mt-1.5 shrink-0" />
                      <span>{sup}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3D Guide phase 3 working card */}
              <div className="p-4 bg-[#EAF4F3] border border-[#087F83]/30 rounded-xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <Sparkles className="w-3 h-3 text-emerald-700" />
                  Phase 3: Interactive 3D Studio Ready
                </div>
                <h3 className="text-xs font-bold text-[#132B3B]">
                  Interactive 3D Assembly & Wiring Guide
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Walk through interactive 3D component models, inspect pin connections, and test the touchless lid simulation in the 3D Build Studio.
                </p>
                <Link
                  href={`/studio?project=${project.id}&workspace=${workspace.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087F83] hover:underline cursor-pointer pt-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Launch 3D Build Studio →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Components & Reservations */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-[#F7F9F8] border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#132B3B] uppercase tracking-wider">
                  Reserved Team Hardware Contributions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  These components are actively reserved for this workspace and excluded from other projects.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Contributed By</th>
                    <th className="py-3 px-4 text-center">Reserved Units</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {workspace.reservations.map((res) => {
                    const owner = allMakers.find((m) => m.id === res.ownerId);
                    return (
                      <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#132B3B]">{res.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            catalogId: {res.catalogId}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">
                            {owner?.displayName || res.ownerId}
                          </span>
                          <div className="text-[11px] text-slate-400">
                            {owner?.locationLabel || 'Local Member'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700 tabular-nums">
                          {res.quantity}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Active Reservation
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remaining Requirements checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#132B3B] uppercase tracking-wider">
              Recipe Requirements Status Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {workspaceMatch.requirementCoverages.map((cov, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs ${
                    cov.isFullyCovered
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/60 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="truncate">{cov.requirement.name}</span>
                    <span className="font-mono">
                      {cov.reservedQuantity}/{cov.requiredQuantity}
                    </span>
                  </div>
                  <div className="text-[11px] mt-1">
                    {cov.isFullyCovered ? (
                      <span className="text-emerald-700">All required units reserved</span>
                    ) : (
                      <span className="text-amber-800 font-medium">
                        Still missing {cov.missingQuantity} unit(s)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#132B3B]">
                Workspace Task Board
              </h2>
              <p className="text-xs text-slate-500">
                Coordinate hardware testing, breadboard assembly, and firmware tasks.
              </p>
            </div>

            {isMember && (
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            )}
          </div>

          {/* Add Task Form */}
          {isAddingTask && (
            <form
              onSubmit={handleCreateTask}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="font-bold text-xs uppercase tracking-wider text-slate-600">
                New Collaboration Task
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Task Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solder motor jumper leads"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Assignee
                  </label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Optional Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ensure heat shrink covers solder joints"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#087F83] rounded-lg"
                >
                  Create Task
                </button>
              </div>
            </form>
          )}

          {/* Kanban Columns (To Do, In Progress, Done) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => {
              const statusTasks = workspace.tasks.filter((t) => t.status === status);
              const columnTitles: Record<TaskStatus, { title: string; color: string }> = {
                todo: { title: 'To Do', color: 'bg-slate-100 text-slate-700' },
                in_progress: { title: 'In Progress', color: 'bg-amber-100 text-amber-800' },
                done: { title: 'Done', color: 'bg-emerald-100 text-emerald-800' },
              };

              return (
                <div key={status} className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${columnTitles[status].color}`}>
                      {columnTitles[status].title}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {statusTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[140px]">
                    {statusTasks.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 italic">
                        No tasks
                      </div>
                    ) : (
                      statusTasks.map((task) => {
                        const assignee = allMakers.find((m) => m.id === task.assigneeId);
                        return (
                          <div
                            key={task.id}
                            className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2"
                          >
                            <div className="font-semibold text-xs text-[#132B3B]">
                              {task.title}
                            </div>
                            {task.description && (
                              <p className="text-[11px] text-slate-500 leading-normal">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                              <span>
                                {assignee ? assignee.displayName : 'Unassigned'}
                              </span>

                              {isMember && (
                                <div className="flex items-center gap-1.5">
                                  {status !== 'todo' && (
                                    <button
                                      onClick={() =>
                                        onUpdateTask(workspace.id, {
                                          ...task,
                                          status: status === 'done' ? 'in_progress' : 'todo',
                                        })
                                      }
                                      className="text-slate-500 hover:text-slate-800 font-bold"
                                      title="Move back"
                                    >
                                      ←
                                    </button>
                                  )}
                                  {status !== 'done' && (
                                    <button
                                      onClick={() =>
                                        onUpdateTask(workspace.id, {
                                          ...task,
                                          status: status === 'todo' ? 'in_progress' : 'done',
                                        })
                                      }
                                      className="text-slate-500 hover:text-[#087F83] font-bold"
                                      title="Advance task"
                                    >
                                      →
                                    </button>
                                  )}
                                  <button
                                    onClick={() => onDeleteTask(workspace.id, task.id)}
                                    className="text-slate-400 hover:text-rose-600"
                                    title="Delete task"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Discussion Messages */}
      {activeTab === 'discussion' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#132B3B]">
              Team Workspace Discussion
            </h2>
            <p className="text-xs text-slate-500">
              Synchronous notes and updates between project collaborators.
            </p>
          </div>

          {/* Messages list */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {workspace.messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                No discussion messages yet. Start the conversation below!
              </div>
            ) : (
              workspace.messages.map((msg) => {
                const author = allMakers.find((m) => m.id === msg.authorId);
                const isAuthor = msg.authorId === activeUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      isAuthor
                        ? 'bg-[#EAF4F3]/60 border-[#087F83]/30 ml-8'
                        : 'bg-slate-50 border-slate-200 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#132B3B]">
                        {author ? author.displayName : msg.authorId}{' '}
                        {isAuthor && '(You)'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* New message input */}
          {isMember ? (
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
              <input
                type="text"
                required
                placeholder={`Post an update as ${activeUser.displayName}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 text-center">
              Posting is restricted to workspace members. Switch to a member profile to post.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Mentorship */}
      {activeTab === 'mentorship' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#132B3B]">
                Mentorship Requests Linked to this Build
              </h2>
              <p className="text-xs text-slate-500">
                Ask experienced mentors for circuit reviews, troubleshooting, or code optimization.
              </p>
            </div>

            {isMember && (
              <button
                onClick={() => onOpenMentorRequest(project.id, workspace.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#087F83] hover:text-white bg-[#EAF4F3] hover:bg-[#087F83] border border-[#087F83]/30 rounded-lg transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ask a Mentor</span>
              </button>
            )}
          </div>

          {linkedMentorRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500 space-y-3">
              <p>No active mentorship requests for this workspace.</p>
              {isMember && (
                <button
                  onClick={() => onOpenMentorRequest(project.id, workspace.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#087F83] rounded-lg cursor-pointer"
                >
                  Submit First Question
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {linkedMentorRequests.map((req) => {
                const mentor = allMakers.find((m) => m.id === req.mentorId);
                const requester = allMakers.find((m) => m.id === req.requesterId);

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700">
                          {req.helpCategory.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-slate-500">
                          Asked by {requester?.displayName || req.requesterId}
                        </span>
                      </div>
                      <span className="text-xs font-semibold capitalize text-[#087F83]">
                        {req.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#132B3B]">
                      {req.question}
                    </h4>

                    {req.notesOrCode && (
                      <pre className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto">
                        {req.notesOrCode}
                      </pre>
                    )}

                    {/* Responses */}
                    {req.responses.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="text-xs font-bold text-slate-600">
                          Responses from Mentor ({mentor?.displayName}):
                        </div>
                        {req.responses.map((resp) => (
                          <div
                            key={resp.id}
                            className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900 leading-relaxed"
                          >
                            {resp.content}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {isConfirmingCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#132B3B]">
              Cancel Collaboration & Release Parts?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cancelling this workspace will immediately release all {workspace.reservations.length} reserved component units back to their respective owners' free inventories.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConfirmingCancel(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Keep Collaboration
              </button>
              <button
                onClick={() => {
                  onCancelWorkspace(workspace.id);
                  setIsConfirmingCancel(false);
                  setLocation('/network');
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
              >
                Release & Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
