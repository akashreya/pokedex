import { useState, useEffect } from "react";

interface PokemonForm {
  id: number;
  name: string;
  form_name: string;
  form_names: Array<{
    name: string;
    language: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
    front_female: string | null;
    front_shiny_female: string | null;
    back_female: string | null;
    back_shiny_female: string | null;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }>;
  }>;
}

interface UsePokemonFormsReturn {
  forms: PokemonForm[];
  loading: boolean;
  error: string | null;
  defaultForm: PokemonForm | null;
  alternateForms: PokemonForm[];
}

export function usePokemonForms(formUrls: string[]): UsePokemonFormsReturn {
  const [forms, setForms] = useState<PokemonForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formUrls.length) {
      setForms([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchPromises = formUrls.map((url) =>
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch form data: ${res.status}`);
          }
          return res.json();
        })
        .catch((err) => {
          console.error(`Error fetching form from ${url}:`, err);
          return null;
        })
    );

    Promise.all(fetchPromises)
      .then((results) => {
        const validForms = results.filter((form): form is PokemonForm => form !== null);
        setForms(validForms);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch forms data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [formUrls]);

  // Derived values
  const defaultForm = forms.find((form) => !form.form_name) || null;
  const alternateForms = forms.filter((form) => form.form_name);

  return {
    forms,
    loading,
    error,
    defaultForm,
    alternateForms,
  };
} 