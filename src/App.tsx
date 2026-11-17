
import { useState } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import ReactMarkdown from "react-markdown";

import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";
import "./App.css";

Amplify.configure(outputs);

const client = generateClient<Schema>({
  authMode: "userPool",
});

function RecipeGenerator({
  signOut,
}: {
  signOut?: () => void;
}) {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("Any");
  const [cookingTime, setCookingTime] = useState("Any");
  const [recipe, setRecipe] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateRecipe() {
    const items = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!items.length) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    setRecipe("");
    setError("");

    try {
      const { data, errors } =
        await client.queries.askBedrock({
          ingredients: [
            `Ingredients: ${items.join(", ")}`,
            `Cuisine: ${cuisine}`,
            `Maximum total cooking time: ${cookingTime}`,
          ],
        });

      if (errors?.length) {
        throw new Error(
          errors.map((e) => e.message).join("; ")
        );
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.body) {
        throw new Error("No recipe was generated.");
      }

      setRecipe(data.body);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h2>🍳 Recipe Generator</h2>
        <button className="signout" onClick={signOut}>
          Sign Out
        </button>
      </header>

      <main className="container">
        <h1>What's cooking today?</h1>
        <p className="subtitle">
          Enter your ingredients and discover something
          delicious to make.
        </p>

        <div className="form-card">
          <label htmlFor="ingredients">
            Ingredients
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) =>
              setIngredients(e.target.value)
            }
            placeholder="e.g. chicken, rice, onion, tomato"
            rows={3}
          />

          <div className="options">
            <div>
              <label htmlFor="cuisine">
                Cuisine Type
              </label>
              <select
                id="cuisine"
                value={cuisine}
                onChange={(e) =>
                  setCuisine(e.target.value)
                }
              >
                <option>Any</option>
                <option>Nepali</option>
                <option>Indian</option>
                <option>Italian</option>
                <option>Chinese</option>
                <option>Mexican</option>
                <option>American</option>
                <option>Thai</option>
                <option>Mediterranean</option>
              </select>
            </div>

            <div>
              <label htmlFor="time">
                Cooking Time
              </label>
              <select
                id="time"
                value={cookingTime}
                onChange={(e) =>
                  setCookingTime(e.target.value)
                }
              >
                <option>Any</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>
          </div>

          <button
            className="generate"
            onClick={generateRecipe}
            disabled={loading}
          >
            {loading
              ? "Generating recipe..."
              : "Generate Recipe"}
          </button>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </div>

        {recipe && (
          <div className="recipe-card">
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        )}

        <p className="credit">
          Created by <strong>Rajiv Khanal</strong>
        </p>
      </main>
    </div>
  );
}

function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <RecipeGenerator signOut={signOut} />
      )}
    </Authenticator>
  );
}

export default App;
