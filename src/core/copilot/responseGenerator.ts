import { AIContext, AIProvider, AIProviderResponse, ConversationMemory, Intent } from "./copilotTypes";
import * as templates from "./responseTemplates";

export class RuleBasedProvider implements AIProvider {
  async generate(
    context: AIContext,
    intent: Intent,
    memory: ConversationMemory
  ): Promise<AIProviderResponse> {
    const query = memory.messages.length > 0 
      ? memory.messages[memory.messages.length - 1].text 
      : "";

    let text = "";
    
    switch (intent.type) {
      case "SUMMARY":
        text = templates.summaryTemplate(context);
        break;
      case "COUNTRY_QUERY":
        text = templates.countryTemplate(context);
        break;
      case "RECOMMENDATION":
        text = templates.recommendationTemplate(context);
        break;
      case "RISK_ANALYSIS":
        text = templates.riskTemplate(context);
        break;
      case "EDUCATION":
        text = templates.educationTemplate(context, query);
        break;
      case "SIMULATION":
        text = templates.simulationTemplate(context);
        break;
      case "GENERAL":
      default:
        text = templates.generalTemplate(context);
        break;
    }

    // Dynamic reasoning deck logs
    const reasoningLogs = [
      `[CONTEXT] Compressed ${Object.keys(context).length} store state variables into structured AIContext.`,
      `[INTENT] Classified user query as ${intent.type} (Confidence: ${intent.confidence}%, Keywords: ${intent.matchedKeywords.join(", ") || "none"}).`,
      `[SEARCH] Aggregated ${context.activeThreatCount} active threat clusters across ${context.countriesAffected} countries.`,
    ];

    if (context.selectedThreat) {
      reasoningLogs.push(`[FOCUS] Context focused on selected threat node ID: ${context.selectedThreat.id}.`);
    }

    reasoningLogs.push(
      `[TACTICAL] Extracted top attributes: Sector: ${context.topSector}, Campaign: ${context.topCampaign}, Risk: ${context.riskScore}.`,
      `[RESPONSE] Generated secure analytical response using template wrapper.`
    );

    return {
      text,
      reasoningLogs,
    };
  }
}
