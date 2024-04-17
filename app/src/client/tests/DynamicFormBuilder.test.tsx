import { render, fireEvent, screen } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import { renderInContext } from 'wasp/client/test';
import DynamicFormBuilder from '../components/DynamicFormBuilder';
import { JsonSchema } from '../interfaces/models';

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
    render(<DynamicFormBuilder jsonSchema={jsonSchema} />);

    expect(screen.getByLabelText('Model')).toBeInTheDocument();
    expect(screen.getByLabelText('API Key')).toBeInTheDocument();
    expect(screen.getByLabelText('Base Url')).toBeInTheDocument();
    expect(screen.queryByLabelText('API Type')).toBe(null);
  });

  // test('handles user input and form submission', () => {
  //   const logSpy = vi.spyOn(console, 'log');
  //   render(<DynamicFormBuilder jsonSchema={jsonSchema} />);

  //   fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'gpt-4' } });
  //   fireEvent.change(screen.getByLabelText('API Key'), { target: { value: 'test-api-key' } });
  //   fireEvent.change(screen.getByLabelText('Base Url'), { target: { value: 'https://test.com' } });
  //   fireEvent.click(screen.getByText('Submit'));

  //   // Check if console.log is called with the correct form data
  //   expect(logSpy).toHaveBeenCalledWith({
  //     model: 'gpt-4',
  //     api_key: 'test-api-key',
  //     base_url: 'https://test.com',
  //     api_type: 'openai',
  //   });

  //   // Restore console.log
  //   logSpy.mockRestore();
  // });
});
