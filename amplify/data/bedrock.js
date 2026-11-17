
export function request(ctx) {
    const details = ctx.args.ingredients || [];
  
    const prompt = `
  You are a helpful home cooking assistant.
  
  Create ONE simple, delicious recipe based on:
  
  ${details.join("\n")}
  
  RULES:
  - Keep the entire answer short and practical.
  - Use the provided ingredients as much as possible.
  - Follow the requested cuisine and cooking time.
  - Treat cooking time as the maximum total time.
  - If a time limit is unrealistic, briefly explain.
  - Suggest only a few common extra ingredients.
  - Use realistic quantities.
  - Give 3 to 5 short cooking steps.
  - Avoid long explanations and unnecessary sections.
  - Include basic food safety when relevant.
  - Use Markdown formatting.
  
  RESPONSE FORMAT:
  
  # Recipe Name
  
  One sentence describing the dish.
  
  **Time:** X minutes | **Servings:** X
  
  ## Ingredients
  - Ingredient and quantity
  - Ingredient and quantity
  
  ## Instructions
  1. Short instruction.
  2. Short instruction.
  3. Short instruction.
  
  **Tip:** One useful cooking tip.
  
  Aim for approximately 120-180 words.
  `;
  
    return {
      resourcePath:
        "/model/global.amazon.nova-2-lite-v1%3A0/converse",
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [{ text: prompt }],
            },
          ],
          inferenceConfig: {
            maxTokens: 650,
            temperature: 0.5,
          },
        }),
      },
    };
  }
  
  export function response(ctx) {
    if (ctx.error) {
      return {
        body: null,
        error: ctx.error.message,
      };
    }
  
    if (!ctx.result || !ctx.result.body) {
      return {
        body: null,
        error: "No response from Bedrock",
      };
    }
  
    let parsedBody;
  
    try {
      parsedBody = JSON.parse(ctx.result.body);
    } catch (error) {
      return {
        body: null,
        error: "Invalid Bedrock response",
      };
    }
  
    if (ctx.result.statusCode !== 200) {
      return {
        body: null,
        error:
          parsedBody.message ||
          parsedBody.Message ||
          "Bedrock request failed",
      };
    }
  
    const content =
      parsedBody.output &&
      parsedBody.output.message &&
      parsedBody.output.message.content;
  
    if (!content || content.length === 0) {
      return {
        body: null,
        error: "No recipe content returned",
      };
    }
  
    let recipe = "";
  
    for (let i = 0; i < content.length; i++) {
      if (content[i].text) {
        recipe += content[i].text;
      }
    }
  
    return {
      body: recipe || null,
      error: recipe ? null : "Empty recipe response",
    };
  }
  