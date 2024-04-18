import { fireEvent, screen } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import { renderInContext } from 'wasp/client/test';

import DynamicFormBuilder from '../components/DynamicFormBuilder';
import { JsonSchema } from '../interfaces/models';
import { validateForm } from '../services/commonService';

vi.mock('../hooks/useForm', () => ({
  useForm: () => ({
    formData: {
      model: 'gpt-3.5-turbo',
      api_key: '',
      base_url: 'https://api.openai.com/v1',
      api_type: 'openai',
    },
    handleChange: vi.fn(),
  }),
}));

vi.mock('../services/commonService', () => ({
  validateForm: vi.fn(() => Promise.resolve({ success: true })),
}));

const jsonSchema: JsonSchema = {
  properties: {
    model: {
      default: 'gpt-3.5-turbo',
      description: "The model to use for the OpenAI API, e.g. 'gpt-3.5-turbo'",
      enum: ['gpt-4', 'gpt-3.5-turbo'],
      title: 'Model',
      type: 'string',
    },
    api_key: {
      description: "The API key for the OpenAI API, e.g. 'sk-1234567890abcdef1234567890abcdef'",
      title: 'API Key',
      type: 'string',
    },
    base_url: {
      default: 'https://api.openai.com/v1',
      description: 'The base URL of the OpenAI API',
      format: 'uri',
      maxLength: 2083,
      minLength: 1,
      title: 'Base Url',
      type: 'string',
    },
    api_type: {
      const: 'openai',
      default: 'openai',
      description: "The type of the API, must be 'openai'",
      enum: ['openai'],
      title: 'API Type',
      type: 'string',
    },
  },
  required: [''],
  title: '',
  type: '',
};

describe('DynamicFormBuilder', () => {
  test('renders form fields correctly', () => {
    renderInContext(
      <DynamicFormBuilder
        jsonSchema={jsonSchema}
        validationURL='https://some-domain/some-route'
        onSuccessCallback={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Model')).toBeInTheDocument();
    expect(screen.getByLabelText('API Key')).toBeInTheDocument();
    expect(screen.getByLabelText('Base Url')).toBeInTheDocument();
    expect(screen.queryByLabelText('API Type')).toBe(null);
  });
  test('handles form submission successfully', async () => {
    const onSuccessCallback = vi.fn();
    renderInContext(
      <DynamicFormBuilder
        jsonSchema={jsonSchema}
        validationURL='https://some-domain/some-route'
        onSuccessCallback={onSuccessCallback}
      />
    );

    const submitButton = screen.getByTestId('form-submit-button');
    await act(async () => {
      await fireEvent.click(submitButton);
    });

    expect(onSuccessCallback).toHaveBeenCalled();
  });

  test('shows an error message when submission fails', async () => {
    // Mock the validateForm to simulate a failure
    vi.mocked(validateForm).mockImplementationOnce(() => Promise.reject(new Error('Failed to validate')));
    const onSuccessCallback = vi.fn();
    renderInContext(
      <DynamicFormBuilder
        jsonSchema={jsonSchema}
        validationURL='https://some-domain/some-route'
        onSuccessCallback={onSuccessCallback}
      />
    );
    await fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    expect(onSuccessCallback).not.toHaveBeenCalled();
  });
});