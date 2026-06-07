// localStorage-based storage replacing Supabase

const localDB = {
  from: (table: string) => ({
    select: (cols?: string) => ({
      limit: (n: number) => ({
        maybeSingle: async () => {
          const raw = localStorage.getItem(table);
          const data = raw ? JSON.parse(raw) : null;
          return { data: Array.isArray(data) ? data[0] ?? null : data, error: null };
        },
      }),
      order: (col: string, opts?: any) => ({
        then: async (resolve: any) => {
          const raw = localStorage.getItem(table);
          const data = raw ? JSON.parse(raw) : [];
          resolve({ data: Array.isArray(data) ? data : [], error: null });
        },
      }),
    }),
    insert: (rows: any) => ({
      select: () => ({
        single: async () => {
          const raw = localStorage.getItem(table);
          const existing = raw ? JSON.parse(raw) : [];
          const arr = Array.isArray(existing) ? existing : [];
          const newRow = { ...rows, id: crypto.randomUUID(), created_at: new Date().toISOString() };
          arr.push(newRow);
          localStorage.setItem(table, JSON.stringify(arr));
          return { data: newRow, error: null };
        },
      }),
    }),
    upsert: (row: any) => ({
      select: () => ({
        single: async () => {
          localStorage.setItem(table, JSON.stringify(row));
          return { data: row, error: null };
        },
      }),
    }),
    update: (updates: any) => ({
      eq: (col: string, val: any) => ({
        select: () => ({
          single: async () => {
            const raw = localStorage.getItem(table);
            const existing = raw ? JSON.parse(raw) : [];
            const arr = Array.isArray(existing) ? existing : [existing];
            const idx = arr.findIndex((r: any) => r[col] === val);
            if (idx !== -1) arr[idx] = { ...arr[idx], ...updates };
            localStorage.setItem(table, JSON.stringify(arr));
            return { data: arr[idx] ?? null, error: null };
          },
        }),
      }),
    }),
    delete: () => ({
      eq: (col: string, val: any) => ({
        then: async (resolve: any) => {
          const raw = localStorage.getItem(table);
          const arr = raw ? JSON.parse(raw) : [];
          const filtered = arr.filter((r: any) => r[col] !== val);
          localStorage.setItem(table, JSON.stringify(filtered));
          resolve({ error: null });
        },
      }),
    }),
  }),
  channel: (name: string) => ({
    on: () => ({ subscribe: () => ({}) }),
  }),
  removeChannel: () => {},
};

export const supabase = localDB as any;
