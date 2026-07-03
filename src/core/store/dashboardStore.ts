// src/core/store/dashboardStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  DashboardState,
  Threat,
  Toast,
  PresentationMode,
  AIContext,
} from './dashboardTypes';
import { calculateMetrics } from './dashboardUtils';

/**
 * Application wide store (Dashboard Brain).
 * All state domains are kept here, actions are defined inline.
 */
export const useDashboardStore = create<DashboardState>()(
  devtools((set, get) => ({
    version: 1,
    // ----- Threat Domain -----
    threat: {
      threats: [],
      selectedThreatId: null,
      hoveredThreatId: null,
      undoStack: [],
    },
    // ----- AI Domain -----
    ai: {
      activeThreatId: null,
      summary: 'Threat vectors exhibit heightened lockbit activity across multiple sectors.',
      recommendations: [],
      confidence: 91,
      status: 'idle',
      generatedAt: undefined,
      aiEngineRunning: false,
      modelName: 'Shadow-GPT v3 (Security-Native)',
      lastAnalysisTimestamp: undefined,
      threatLevel: 'HIGH',
      primaryCampaign: 'LockBit Ransomware',
      currentSituation: 'Active exfiltration surge targeting critical infrastructures. Lateral movement detected across multiple domains using SMB protocols.',
      predictedNextTarget: 'Healthcare Providers (EU / North America)',
      topTargetedSector: 'Financial Services & Energy Grid',
      recommendedActions: [
        'Increase email gateway filtering',
        'Block outbound SMB traffic',
        'Patch internet-facing Apache servers',
        'Enable MFA for privileged users'
      ],
    },
    // ----- Metrics Domain -----
    metrics: {
      totals: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        totalThreats: 0,
      },
      trends: {
        lastHour: 0,
        last24Hours: 0,
        delta: 0,
      },
    },
    // ----- UI / Notification Domain -----
    ui: {
      toastQueue: [],
    },
    // ----- Presentation Mode (formerly DemoMode) -----
    presentation: {
      enabled: false,
      scenario: null,
      speed: 1,
      autoplay: false,
    },

    // ==================== Actions ====================

    // Threat actions
    addThreat: (threat: Threat) => {
      set(state => {
        const newThreats = [...state.threat.threats, threat];
        return {
          threat: { ...state.threat, threats: newThreats },
          metrics: calculateMetrics(newThreats),
        };
      });
    },
    removeThreat: (id: string) => {
      set(state => {
        const newThreats = state.threat.threats.filter(t => t.id !== id);
        const newSelected = state.threat.selectedThreatId === id ? null : state.threat.selectedThreatId;
        return {
          threat: { ...state.threat, threats: newThreats, selectedThreatId: newSelected },
          metrics: calculateMetrics(newThreats),
        };
      });
    },
    selectThreat: (id: string) => {
      set(state => {
        const prev = state.threat.selectedThreatId;
        const newUndo = prev ? [...state.threat.undoStack, prev] : state.threat.undoStack;
        return {
          threat: { ...state.threat, selectedThreatId: id, undoStack: newUndo },
          ai: { ...state.ai, activeThreatId: id },
        };
      });
    },
    hoverThreat: (id: string | null) => {
      set(state => ({ threat: { ...state.threat, hoveredThreatId: id } }));
    },
    undoSelection: () => {
      set(state => {
        const stack = [...state.threat.undoStack];
        const previous = stack.pop();
        return {
          threat: { ...state.threat, selectedThreatId: previous || null, undoStack: stack },
          ai: { ...state.ai, activeThreatId: previous || null },
        };
      });
    },
    clearUndoStack: () => {
      set(state => ({ threat: { ...state.threat, undoStack: [] } }));
    },

    // UI / Notification actions
    enqueueToast: (toast: Toast) => {
      set(state => ({ ui: { ...state.ui, toastQueue: [...state.ui.toastQueue, toast] } }));
    },
    dequeueToast: (id: string) => {
      set(state => ({ ui: { ...state.ui, toastQueue: state.ui.toastQueue.filter(t => t.id !== id) } }));
    },

    // Presentation mode actions
    setPresentationEnabled: (enabled: boolean) => {
      set(state => ({ presentation: { ...state.presentation, enabled } }));
    },
    setPresentationScenario: (scenario: PresentationMode['scenario']) => {
      set(state => ({ presentation: { ...state.presentation, scenario } }));
    },
    setPresentationSpeed: (speed: number) => {
      set(state => ({ presentation: { ...state.presentation, speed } }));
    },
    setPresentationAutoplay: (autoplay: boolean) => {
      set(state => ({ presentation: { ...state.presentation, autoplay } }));
    },

    // AI context actions
    setAIStatus: (status: AIContext['status']) => {
      set(state => ({ ai: { ...state.ai, status } }));
    },
    setAISummary: (summary: string) => {
      set(state => ({ ai: { ...state.ai, summary } }));
    },
    setAIRecommendations: (recs: string[]) => {
      set(state => ({ ai: { ...state.ai, recommendations: recs } }));
    },
    setAIConfidence: (conf: number) => {
      set(state => ({ ai: { ...state.ai, confidence: conf } }));
    },
    setAIGeneratedAt: (date: Date) => {
      set(state => ({ ai: { ...state.ai, generatedAt: date } }));
    },
    setThreats: (threats: Threat[]) => {
      set(state => ({
        threat: { ...state.threat, threats },
        metrics: calculateMetrics(threats),
      }));
    },
    setAIEngineRunning: (aiEngineRunning: boolean) => {
      set(state => ({ ai: { ...state.ai, aiEngineRunning } }));
    },
    updateAISituationReport: (report: Partial<AIContext>) => {
      set(state => ({ ai: { ...state.ai, ...report } }));
    },
    triggerAIAnalysis: () => {
      set(state => ({ ai: { ...state.ai, aiEngineRunning: true, status: 'generating' } }));
      
      setTimeout(() => {
        const threats = get().threat.threats;
        
        // Generate a dynamic and realistic Situation Report based on active threats
        const activeThreats = threats.filter(t => t.status === 'Active');
        const hasCrit = activeThreats.some(t => t.severity === 'crit');
        const hasHigh = activeThreats.some(t => t.severity === 'high');
        
        const threatLevel = hasCrit ? 'CRITICAL' : hasHigh ? 'HIGH' : 'MEDIUM';
        
        // Find most frequent sector
        const sectors = activeThreats.map(t => t.sector || t.targetIndustry).filter(Boolean) as string[];
        const topSector = sectors.length > 0 
          ? sectors.sort((a,b) => sectors.filter(v => v===a).length - sectors.filter(v => v===b).length).pop() || 'Financial Services'
          : 'Defense & Healthcare';
          
        // Find primary campaigns
        const actors = activeThreats.map(t => t.attackerActor).filter(Boolean) as string[];
        const primaryCampaign = actors.length > 0
          ? `${actors[0]} Campaign`
          : 'LockBit Ransomware';

        // Custom situation texts
        const situation = activeThreats.length > 0
          ? `Detected ${activeThreats.length} active intrusion campaigns. Lateral movement and volumetric exfiltration observed in ${topSector} networks.`
          : 'Global intelligence channels indicate stable quietude, with passive recon scans targeting legacy SSH interfaces.';

        // Next target prediction
        const predictedTarget = activeThreats.length > 0
          ? `${topSector} endpoints in ${activeThreats[0].targetCountry}`
          : 'Government cloud directories (Asia Pacific)';

        // Recommendations matching the category of the threats
        const recs = [
          'Increase email gateway filtering',
          'Block outbound SMB traffic',
          'Patch internet-facing Apache servers',
          'Enable MFA for privileged users'
        ];
        
        if (activeThreats.some(t => t.category === 'Ransomware')) {
          recs.unshift('Isolate active directory domains and verify cold backups');
        }
        if (activeThreats.some(t => t.category === 'DDoS')) {
          recs.unshift('Reroute inbound DNS traffic through Scrubbing Gateways');
        }
        if (activeThreats.some(t => t.category === 'Exploit')) {
          recs.unshift('Deploy immediate micro-segmentation to SCADA OT networks');
        }
        
        // Keep unique recommendations and limit to 4
        const uniqueRecs = Array.from(new Set(recs)).slice(0, 4);

        // Confidence calculation
        const confidence = activeThreats.length > 0 
          ? Math.min(99, 85 + activeThreats.length * 3)
          : 91;

        set(state => ({
          ai: {
            ...state.ai,
            aiEngineRunning: false,
            status: 'ready',
            lastAnalysisTimestamp: Date.now(),
            threatLevel: threatLevel as any,
            primaryCampaign,
            currentSituation: situation,
            predictedNextTarget: predictedTarget,
            topTargetedSector: topSector,
            recommendedActions: uniqueRecs,
            confidence
          }
        }));
      }, 1000);
    }
  }))
);
