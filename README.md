# 🍳 AI Recipe Generator

An AI-powered recipe generation web application built with **React, TypeScript, AWS Amplify, and Amazon Bedrock**.

The application helps users turn ingredients they already have into practical, personalized recipes. Users can specify ingredients, preferred cuisine, and cooking time to receive AI-generated cooking instructions.

## Features

- **AI-Powered Recipes** — Generate recipes using Amazon Nova 2 Lite through Amazon Bedrock.
- **Ingredient-Based Suggestions** — Create recipes using available ingredients.
- **Cuisine Preferences** — Customize recipes based on preferred cuisine.
- **Cooking Time** — Request recipes within a desired preparation time.
- **User Authentication** — Sign up and sign in using Amazon Cognito through AWS Amplify.
- **Serverless Backend** — Process recipe requests through AWS AppSync GraphQL.
- **Responsive Interface** — Built with React and TypeScript.
- **Formatted Results** — Display recipes with ingredients, instructions, and cooking tips.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Authentication | Amazon Cognito |
| Backend | AWS Amplify Gen 2 |
| API | AWS AppSync GraphQL |
| AI Model | Amazon Nova 2 Lite |
| AI Service | Amazon Bedrock |
| Hosting | AWS Amplify Hosting |
| Version Control | Git and GitHub |

## System Architecture

```text
User
  |
  v
React + TypeScript Frontend
  |
  v
AWS Amplify Authentication
  |
  v
Amazon Cognito
  |
  v
AWS AppSync GraphQL API
  |
  v
AppSync JavaScript Resolver
  |
  v
Amazon Bedrock
  |
  v
Amazon Nova 2 Lite
  |
  v
AI-Generated Recipe
  |
  v
React Frontend
```

After authentication, the frontend sends a GraphQL request containing the user's recipe preferences. AppSync invokes Amazon Bedrock through an IAM-authorized HTTP data source. The resolver processes the model response and returns the generated recipe to the frontend.

## Getting Started

### Prerequisites

- Node.js and npm
- AWS account with access to the required services
- AWS CLI configured with appropriate permissions
- AWS Amplify Gen 2 development environment

### Installation

Clone the repository:

```bash
git clone https://github.com/rajiv48/ai-recipe-generator.git
cd ai-recipe-generator
```

Install dependencies:

```bash
npm ci
```

### Backend Setup

Configure your AWS credentials and follow the AWS Amplify Gen 2 sandbox setup process.

Start a development sandbox:

```bash
npx ampx sandbox
```

This deploys the development backend and generates `amplify_outputs.json`, which contains the configuration needed by the frontend.

### Run Locally

In a separate terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite.

### Production Build

```bash
npm run build
```

The production frontend is generated in the `dist/` directory.

## How It Works

1. A user signs in through Amazon Cognito.
2. The user enters available ingredients and recipe preferences.
3. The React frontend calls the `askBedrock` GraphQL operation.
4. The AppSync JavaScript resolver constructs a recipe-generation prompt.
5. Amazon Bedrock processes the request using Amazon Nova 2 Lite.
6. The generated recipe is returned to the frontend and displayed in Markdown format.

## Security

- Amazon Cognito manages user authentication.
- The GraphQL recipe-generation operation requires authentication.
- AppSync uses AWS IAM permissions to invoke Amazon Bedrock.
- Bedrock requests are handled by the backend rather than exposing AWS credentials in the browser.

## Future Improvements

- Save favorite recipes.
- Maintain recipe-generation history.
- Add dietary restrictions and allergy preferences.
- Generate grocery shopping lists.
- Support recipe ratings and feedback.
- Improve accessibility and mobile usability.

## Author

**Rajiv Khanal**

GitHub: [@rajiv48](https://github.com/rajiv48)

## License

No open-source license has been assigned yet. All rights are reserved unless a license is added to the repository.
