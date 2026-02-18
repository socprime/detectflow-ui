import { RunTransformTestResult, TopicEvent } from '@/models/providers';

export const normalizeLineEndings = (value: string) => value.replace(/\r\n/g, '\n');

const VALID_FIELD_KEY_REGEX = /^[a-zA-Z_][a-zA-Z0-9_.\-]*$/;

const isValidFieldKey = (key: string): boolean => {
  return VALID_FIELD_KEY_REGEX.test(key);
};

export const getMappingKey = (line: string) => {
  const match = line.match(/^\s*([^#:\s][^:]*)\s*:\s*.*$/);
  if (!match) return null;
  const key = match[1].trim();
  return isValidFieldKey(key) ? key : null;
};

interface MappingField {
  key: string;
  value: string | string[] | null;
}

export const parseMappingFields = (mapping: string): MappingField[] => {
  const lines = normalizeLineEndings(mapping || '').split('\n');
  const fields: MappingField[] = [];
  let currentField: MappingField | null = null;

  for (const line of lines) {
    const keyMatch = line.match(/^([^#:\s][^:]*)\s*:\s*(.*)$/);
    const commentedKeyMatch = line.match(/^#\s*([^#:\s][^:]*)\s*:\s*$/);

    if (keyMatch) {
      const key = keyMatch[1].trim();

      if (currentField) {
        fields.push(currentField);
        currentField = null;
      }

      if (isValidFieldKey(key)) {
        const inlineValue = keyMatch[2].trim();

        currentField = {
          key,
          value: inlineValue || null,
        };
      }
    } else if (commentedKeyMatch) {
      const key = commentedKeyMatch[1].trim();

      if (currentField) {
        fields.push(currentField);
        currentField = null;
      }

      if (isValidFieldKey(key)) {
        currentField = {
          key,
          value: null,
        };
      }
    } else if (currentField) {
      const arrayItemMatch = line.match(/^\s+-\s*(.*)$/);
      if (arrayItemMatch) {
        const itemValue = arrayItemMatch[1].trim();
        if (!Array.isArray(currentField.value)) {
          currentField.value = [];
        }
        currentField.value.push(itemValue);
      }
    }
  }

  if (currentField) {
    fields.push(currentField);
  }

  return fields;
};

const hasValue = (field: MappingField): boolean => {
  if (field.value === null || field.value === '') {
    return false;
  }
  if (Array.isArray(field.value)) {
    return field.value.length > 0 && field.value.some((v) => v.trim() !== '');
  }
  return true;
};

const serializeField = (field: MappingField, commentIfEmpty: boolean = false): string => {
  const isEmpty =
    field.value === null ||
    field.value === '' ||
    (Array.isArray(field.value) && field.value.length === 0);

  if (isEmpty) {
    return commentIfEmpty ? `# ${field.key}:` : `${field.key}:`;
  }

  if (Array.isArray(field.value)) {
    const items = field.value.map((item) => `  - ${item}`).join('\n');
    return `${field.key}:\n${items}`;
  }

  return `${field.key}: ${field.value}`;
};

const mergeArrayValues = (oldArr: string[], newArr: string[]): string[] => {
  const result: string[] = [];
  const newSet = new Set(newArr);
  const usedFromNew = new Set<string>();

  for (const oldItem of oldArr) {
    if (newSet.has(oldItem)) {
      result.push(oldItem);
      usedFromNew.add(oldItem);
    } else {
      result.push(oldItem);
    }
  }

  for (const newItem of newArr) {
    if (!usedFromNew.has(newItem)) {
      result.push(newItem);
    }
  }

  return result;
};

export const mergeMappings = (
  existing: string,
  generated: string,
  replaceExisting: boolean,
): string => {
  const existingFields = parseMappingFields(existing);
  const generatedFields = parseMappingFields(generated);
  const generatedMap = new Map<string, MappingField>();

  for (const field of generatedFields) {
    generatedMap.set(field.key, field);
  }

  const resultMap = new Map<string, MappingField>();

  for (const existingField of existingFields) {
    const generatedField = generatedMap.get(existingField.key);

    if (!generatedField) {
      resultMap.set(existingField.key, existingField);
    } else {
      const existingIsArray = Array.isArray(existingField.value);
      const generatedIsArray = Array.isArray(generatedField.value);

      if (existingIsArray && generatedIsArray) {
        const mergedValue = mergeArrayValues(
          existingField.value as string[],
          generatedField.value as string[],
        );
        resultMap.set(existingField.key, { key: existingField.key, value: mergedValue });
      } else if (replaceExisting) {
        resultMap.set(existingField.key, generatedField);
      } else {
        resultMap.set(existingField.key, existingField);
      }
    }
  }

  for (const generatedField of generatedFields) {
    if (!resultMap.has(generatedField.key)) {
      resultMap.set(generatedField.key, generatedField);
    }
  }

  const mappedFields: MappingField[] = [];
  const unmappedFields: MappingField[] = [];

  for (const field of resultMap.values()) {
    if (hasValue(field)) {
      mappedFields.push(field);
    } else {
      unmappedFields.push(field);
    }
  }

  const sortByKey = (a: MappingField, b: MappingField) =>
    a.key.toLowerCase().localeCompare(b.key.toLowerCase());

  mappedFields.sort(sortByKey);
  unmappedFields.sort(sortByKey);

  const mappedLines = mappedFields.map((field) => serializeField(field, false));
  const unmappedLines = unmappedFields.map((field) => serializeField(field, true));

  if (mappedLines.length > 0 && unmappedLines.length > 0) {
    return [...mappedLines, '', ...unmappedLines].join('\n');
  }

  return [...mappedLines, ...unmappedLines].join('\n');
};

export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatValue(item)).join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1).replace(/""/g, '"');
    }
    return trimmed;
  }

  return String(value);
};

export const parseTestResult = (value: unknown): RunTransformTestResult[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const mapTopicEventsToResults = (events: TopicEvent[]): RunTransformTestResult[] => {
  return events.map((event) => ({
    source_data: event.event,
    parsed_data: undefined,
    success: true,
    source_topic: event.topic,
    error_message: '',
  }));
};
