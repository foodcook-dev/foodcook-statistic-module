export type FormDataFields = Record<string, string | number | boolean | null | undefined | object>;

export function buildFormData(
  ...sources: Array<{
    fields: FormDataFields;
    files?: Record<string, File | null | undefined>;
    prefix?: string;
  }>
): FormData {
  const formData = new FormData();

  sources.forEach(({ fields, files, prefix }) => {
    const key = (k: string) => (prefix ? `${prefix}.${k}` : k);

    Object.entries(fields).forEach(([k, value]) => {
      if (value === null || value === undefined) formData.append(key(k), '');
      else if (typeof value === 'boolean') formData.append(key(k), String(value));
      else if (typeof value === 'object') formData.append(key(k), JSON.stringify(value));
      else formData.append(key(k), String(value));
    });

    Object.entries(files ?? {}).forEach(([k, file]) => {
      if (file instanceof File) formData.append(key(k), file);
    });
  });

  return formData;
}
