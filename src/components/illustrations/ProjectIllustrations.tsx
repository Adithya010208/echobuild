/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export function ProjectIllustration({
  illustrationKey,
  className = '',
}: {
  illustrationKey: string;
  className?: string;
}) {
  switch (illustrationKey) {
    case 'smart-dustbin':
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Background subtle tint */}
          <rect width="400" height="240" rx="12" fill="#EAF4F3" />
          
          {/* Floor line */}
          <line x1="40" y1="210" x2="360" y2="210" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Dustbin Base Body */}
          <path
            d="M130 90 L140 200 C141 205 145 208 150 208 L220 208 C225 208 229 205 230 200 L240 90 Z"
            fill="#FFFFFF"
            stroke="#132B3B"
            strokeWidth="3"
          />
          {/* Bin accent stripe */}
          <path d="M135 140 L235 140" stroke="#087F83" strokeWidth="4" strokeLinecap="round" />
          <path d="M137 155 L233 155" stroke="#CBD5E1" strokeWidth="2" />
          
          {/* Bin Hinge & Servo mechanism */}
          <rect x="232" y="86" width="16" height="20" rx="3" fill="#132B3B" />
          <circle cx="240" cy="96" r="4" fill="#087F83" />
          <path d="M240 96 L220 70" stroke="#087F83" strokeWidth="3" strokeLinecap="round" />
          
          {/* Flap Lid (lifted open at angle) */}
          <g transform="rotate(-38 240 85)">
            <path
              d="M110 75 L245 75 C248 75 250 78 250 82 L248 88 L108 88 C105 88 103 85 105 82 Z"
              fill="#087F83"
              stroke="#132B3B"
              strokeWidth="2.5"
            />
            <rect x="165" y="65" width="26" height="10" rx="3" fill="#132B3B" />
          </g>

          {/* Ultrasonic Sensor (Dual Eyes) */}
          <rect x="90" y="110" width="34" height="22" rx="4" fill="#132B3B" />
          <circle cx="99" cy="121" r="6" fill="#087F83" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="115" cy="121" r="6" fill="#087F83" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M107 132 L107 170 L135 170" stroke="#64748B" strokeWidth="2" strokeDasharray="2 2" />

          {/* Sonar waves emitting */}
          <path d="M80 114 A 12 12 0 0 0 80 128" stroke="#087F83" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M72 108 A 20 20 0 0 0 72 134" stroke="#087F83" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
          <path d="M64 102 A 28 28 0 0 0 64 140" stroke="#087F83" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />

          {/* Approaching Hand Silhouette */}
          <g transform="translate(15, 75)">
            <path
              d="M10 25 C15 20 25 15 35 22 C38 18 45 18 48 23 C52 19 58 20 60 25 L65 35 C65 42 55 52 45 50 L10 38 Z"
              fill="#132B3B"
              opacity="0.85"
            />
          </g>

          {/* Eco Recycled badge */}
          <g transform="translate(300, 30)">
            <rect width="70" height="28" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="35" y="18" fill="#087F83" fontSize="11" fontWeight="700" textAnchor="middle">
              RECYCLE
            </text>
          </g>
        </svg>
      );

    case 'night-light':
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <rect width="400" height="240" rx="12" fill="#F1F5F9" />
          
          {/* Bedside table surface */}
          <rect x="50" y="180" width="300" height="12" rx="4" fill="#334155" />
          <rect x="70" y="192" width="12" height="35" rx="2" fill="#64748B" />
          <rect x="318" y="192" width="12" height="35" rx="2" fill="#64748B" />

          {/* Soft ambient night glow */}
          <circle cx="200" cy="115" r="75" fill="#FEF08A" opacity="0.45" />
          <circle cx="200" cy="115" r="45" fill="#FDE047" opacity="0.6" />

          {/* Lamp Base */}
          <ellipse cx="200" cy="178" rx="42" ry="10" fill="#132B3B" />
          <rect x="195" y="130" width="10" height="48" fill="#087F83" />

          {/* Lamp Shade (Lantern style) */}
          <path
            d="M170 135 L230 135 L215 80 L185 80 Z"
            fill="#FFFFFF"
            stroke="#132B3B"
            strokeWidth="3"
          />
          <circle cx="200" cy="110" r="12" fill="#F59E0B" />

          {/* LDR Sensor Circuit on Side */}
          <rect x="80" y="130" width="48" height="36" rx="6" fill="#FFFFFF" stroke="#087F83" strokeWidth="2" />
          <circle cx="104" cy="148" r="9" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          {/* LDR squiggly line */}
          <path d="M98 148 C100 144 102 152 104 148 C106 144 108 152 110 148" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <line x1="128" y1="148" x2="195" y2="148" stroke="#087F83" strokeWidth="2" strokeDasharray="3 3" />

          {/* Sun / Moon duality cue */}
          <g transform="translate(310, 40)">
            <path
              d="M20 5 A18 18 0 1 0 42 28 A15 15 0 0 1 20 5 Z"
              fill="#132B3B"
            />
            <circle cx="28" cy="18" r="2" fill="#FEF08A" />
            <circle cx="36" cy="30" r="1.5" fill="#FEF08A" />
          </g>
          
          <text x="104" y="174" fill="#64748B" fontSize="10" fontWeight="600" textAnchor="middle">
            LDR SENSOR
          </text>
        </svg>
      );

    case 'parking-indicator':
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <rect width="400" height="240" rx="12" fill="#EAF4F3" />
          
          {/* Garage Wall */}
          <rect x="30" y="40" width="110" height="150" rx="8" fill="#FFFFFF" stroke="#132B3B" strokeWidth="3" />
          
          {/* Traffic LED indicator cluster */}
          <circle cx="85" cy="72" r="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <circle cx="85" cy="108" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <circle cx="85" cy="144" r="14" fill="#10B981" stroke="#059669" strokeWidth="2" />

          {/* Buzzer sound waves from unit */}
          <path d="M145 65 Q 165 72 145 80" stroke="#087F83" strokeWidth="2.5" fill="none" />
          <path d="M155 58 Q 185 72 155 88" stroke="#087F83" strokeWidth="2" fill="none" opacity="0.6" />

          {/* Ultrasonic sonar sensor */}
          <rect x="70" y="165" width="30" height="14" rx="3" fill="#132B3B" />
          <circle cx="78" cy="172" r="4" fill="#94A3B8" />
          <circle cx="92" cy="172" r="4" fill="#94A3B8" />

          {/* Sonar Beam to Vehicle */}
          <polygon points="105,172 260,130 260,200" fill="#087F83" opacity="0.12" />
          <line x1="105" y1="172" x2="260" y2="165" stroke="#087F83" strokeWidth="2" strokeDasharray="4 4" />

          {/* Approaching Car Front Bumper & Grill */}
          <path
            d="M260 120 C270 115 310 115 350 125 L370 150 L370 205 L260 205 Z"
            fill="#132B3B"
          />
          {/* Headlight */}
          <polygon points="265,130 290,135 285,150 262,145" fill="#FEF08A" />
          {/* Wheel */}
          <circle cx="340" cy="205" r="24" fill="#334155" stroke="#64748B" strokeWidth="4" />

          {/* Distance overlay banner */}
          <rect x="155" y="188" width="76" height="24" rx="4" fill="#FFFFFF" stroke="#087F83" strokeWidth="1.5" />
          <text x="193" y="204" fill="#132B3B" fontSize="11" fontWeight="700" textAnchor="middle">
            STOP: 35cm
          </text>
        </svg>
      );

    case 'temperature-display':
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <rect width="400" height="240" rx="12" fill="#F8FAFC" />
          
          {/* Desktop Table Surface */}
          <rect x="40" y="195" width="320" height="8" rx="2" fill="#E2E8F0" />

          {/* Stand / Case */}
          <path d="M110 200 L130 150 L270 150 L290 200 Z" fill="#E2E8F0" />
          <rect x="100" y="55" width="200" height="120" rx="14" fill="#132B3B" stroke="#087F83" strokeWidth="3" />
          
          {/* Micro OLED Screen */}
          <rect x="115" y="70" width="170" height="90" rx="6" fill="#0A0F1D" />

          {/* Screen Content - Temperature Wave */}
          <text x="130" y="96" fill="#38BDF8" fontSize="20" fontWeight="700" fontFamily="monospace">
            23.5°C
          </text>
          <text x="235" y="96" fill="#34D399" fontSize="14" fontWeight="600" fontFamily="monospace">
            52% RH
          </text>

          {/* Wave line graph */}
          <path
            d="M130 135 Q 150 115 170 130 T 210 120 T 250 140 T 275 125"
            stroke="#38BDF8"
            strokeWidth="2.5"
            fill="none"
          />

          {/* DHT11 Blue Sensor Module on Breadboard */}
          <g transform="translate(48, 90)">
            <rect width="36" height="48" rx="4" fill="#0284C7" stroke="#132B3B" strokeWidth="2" />
            {/* Grid vents */}
            <line x1="6" y1="12" x2="30" y2="12" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="6" y1="18" x2="30" y2="18" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="6" y1="24" x2="30" y2="24" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="6" y1="30" x2="30" y2="30" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Pins */}
            <line x1="12" y1="48" x2="12" y2="62" stroke="#94A3B8" strokeWidth="2" />
            <line x1="18" y1="48" x2="18" y2="62" stroke="#94A3B8" strokeWidth="2" />
            <line x1="24" y1="48" x2="24" y2="62" stroke="#94A3B8" strokeWidth="2" />
          </g>

          {/* I2C Cable Ribbon */}
          <path d="M84 125 C 95 125 98 100 115 100" stroke="#F59E0B" strokeWidth="2.5" />
          <path d="M84 130 C 95 130 98 105 115 105" stroke="#10B981" strokeWidth="2.5" />

          <text x="200" y="222" fill="#64748B" fontSize="11" fontWeight="600" textAnchor="middle">
            I2C DIGITAL TELEMETRY
          </text>
        </svg>
      );

    case 'plant-monitor':
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <rect width="400" height="240" rx="12" fill="#EAF4F3" />
          
          {/* Terracotta Plant Pot */}
          <polygon points="120,120 180,120 170,210 130,210" fill="#EA580C" stroke="#132B3B" strokeWidth="2.5" />
          <rect x="114" y="112" width="72" height="12" rx="3" fill="#C2410C" stroke="#132B3B" strokeWidth="2" />

          {/* Soil */}
          <ellipse cx="150" cy="120" rx="30" ry="6" fill="#78350F" />

          {/* Plant Stems & Green Leaves */}
          <path d="M150 120 Q 140 70 120 50" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
          <path d="M120 50 Q 105 50 115 65 Q 130 75 120 50" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />

          <path d="M150 100 Q 165 75 185 60" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M185 60 Q 200 65 190 80 Q 175 85 185 60" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />

          {/* Capacitive Moisture Probe inserted into soil */}
          <polygon points="144,120 156,120 153,190 147,190" fill="#1E293B" stroke="#087F83" strokeWidth="1.5" />

          {/* ESP32 Controller Box on Stake */}
          <rect x="230" y="80" width="80" height="100" rx="8" fill="#FFFFFF" stroke="#132B3B" strokeWidth="2.5" />
          <rect x="242" y="92" width="56" height="34" rx="4" fill="#087F83" />
          <text x="270" y="113" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
            ESP32
          </text>
          
          {/* Sunlight LDR on top of case */}
          <circle cx="270" cy="74" r="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          <line x1="270" y1="62" x2="270" y2="54" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <line x1="282" y1="68" x2="288" y2="62" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <line x1="258" y1="68" x2="252" y2="62" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

          {/* Probe connection wires */}
          <path d="M150 130 C 180 140 200 135 230 135" stroke="#087F83" strokeWidth="2" strokeDasharray="3 3" />

          {/* Status badge */}
          <rect x="240" y="142" width="60" height="22" rx="4" fill="#DCFCE7" />
          <text x="270" y="157" fill="#15803D" fontSize="10" fontWeight="700" textAnchor="middle">
            SOIL: MOIST
          </text>
        </svg>
      );

    case 'obstacle-robot':
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <rect width="400" height="240" rx="12" fill="#F1F5F9" />
          
          {/* Grid test floor */}
          <line x1="40" y1="210" x2="360" y2="210" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="60" y1="180" x2="340" y2="180" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* Left & Right Big Wheels */}
          <rect x="110" y="140" width="22" height="65" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="268" y="140" width="22" height="65" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />

          {/* Robot Acrylic Chassis Main Deck */}
          <rect x="125" y="125" width="150" height="60" rx="12" fill="#FFFFFF" stroke="#132B3B" strokeWidth="3" />
          <rect x="135" y="135" width="130" height="40" rx="6" fill="#EAF4F3" />

          {/* Rotating Servo Turret Mount */}
          <rect x="180" y="95" width="40" height="30" rx="4" fill="#087F83" stroke="#132B3B" strokeWidth="2" />
          
          {/* Sonar Sensor 'Eyes' Head */}
          <rect x="165" y="65" width="70" height="32" rx="6" fill="#132B3B" />
          <circle cx="184" cy="81" r="10" fill="#94A3B8" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="216" cy="81" r="10" fill="#94A3B8" stroke="#FFFFFF" strokeWidth="2" />

          {/* Sonar Scan Radar Rays */}
          <path d="M150 55 A 50 50 0 0 1 250 55" stroke="#087F83" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          <path d="M135 40 A 75 75 0 0 1 265 40" stroke="#087F83" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />

          {/* Red Obstacle Box in Distance */}
          <rect x="300" y="120" width="45" height="55" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <text x="322" y="152" fill="#FFFFFF" fontSize="12" fontWeight="700" textAnchor="middle">
            WALL
          </text>

          {/* Front Caster Wheel */}
          <circle cx="200" cy="195" r="9" fill="#64748B" />
        </svg>
      );

    case 'door-alert':
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <rect width="400" height="240" rx="12" fill="#EAF4F3" />
          
          {/* Door Frame */}
          <rect x="80" y="30" width="18" height="180" fill="#132B3B" />
          <rect x="300" y="30" width="18" height="180" fill="#132B3B" />
          <rect x="80" y="30" width="238" height="18" fill="#132B3B" />

          {/* Doorway Entrance Void */}
          <rect x="98" y="48" width="202" height="162" fill="#FFFFFF" opacity="0.9" />

          {/* Ultrasonic Alert Unit on Door Post */}
          <rect x="98" y="110" width="36" height="45" rx="5" fill="#087F83" stroke="#132B3B" strokeWidth="2" />
          <circle cx="116" cy="125" r="7" fill="#FFFFFF" />
          <circle cx="116" cy="142" r="4" fill="#EF4444" /> {/* Alert LED */}

          {/* Invisible Sonar Tripwire Beam */}
          <line x1="134" y1="125" x2="300" y2="125" stroke="#087F83" strokeWidth="3" strokeDasharray="5 4" />
          
          {/* Walking Person Silhouette Crossing Beam */}
          <g transform="translate(190, 80)">
            <circle cx="15" cy="10" r="10" fill="#334155" />
            <path d="M15 22 L15 65 M15 35 L0 50 M15 35 L30 45 M15 65 L5 100 M15 65 L28 95" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Chime Bell Icon */}
          <g transform="translate(45, 105)">
            <path d="M18 6 A10 10 0 0 0 8 16 L6 26 L20 26 L18 6 Z" fill="#F59E0B" />
            <circle cx="13" cy="29" r="3" fill="#D97706" />
          </g>
        </svg>
      );

    case 'reaction-game':
    default:
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <rect width="400" height="240" rx="12" fill="#F8FAFC" />
          
          {/* Arcade Console Console Base */}
          <polygon points="60,170 340,170 320,110 80,110" fill="#132B3B" stroke="#087F83" strokeWidth="3" />
          <rect x="60" y="170" width="280" height="30" rx="4" fill="#0A0F1D" />

          {/* Player 1 Button (Blue Arcade Cap) */}
          <rect x="110" y="125" width="45" height="25" rx="6" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
          <text x="132" y="142" fill="#FFFFFF" fontSize="10" fontWeight="800" textAnchor="middle">
            P1
          </text>
          
          {/* Center GO / Ready Indicator LED */}
          <circle cx="200" cy="135" r="18" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="200" cy="135" r="28" fill="#10B981" opacity="0.25" />
          <text x="200" y="139" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle">
            GO!
          </text>

          {/* Player 2 Button (Red Arcade Cap) */}
          <rect x="245" y="125" width="45" height="25" rx="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
          <text x="267" y="142" fill="#FFFFFF" fontSize="10" fontWeight="800" textAnchor="middle">
            P2
          </text>

          {/* Digital Timer Display */}
          <rect x="150" y="60" width="100" height="34" rx="6" fill="#132B3B" stroke="#334155" strokeWidth="2" />
          <text x="200" y="83" fill="#38BDF8" fontSize="16" fontWeight="700" fontFamily="monospace" textAnchor="middle">
            184 ms
          </text>

          <text x="200" y="215" fill="#64748B" fontSize="11" fontWeight="600" textAnchor="middle">
            DUAL-PLAYER MILLISECOND REFLEX ARBITER
          </text>
        </svg>
      );
  }
}
