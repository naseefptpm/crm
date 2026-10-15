import { User, ContactFormData } from '../types/crm';

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Fetch all users from JSONPlaceholder REST API
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: HTTP ${response.status} ${response.statusText}`);
  }
  const data: User[] = await response.json();
  return data;
}

/**
 * Create a new user (POST /users)
 */
export async function createContactApi(payload: ContactFormData): Promise<User> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create contact: HTTP ${response.status} ${response.statusText}`);
  }

  const createdUser = await response.json();
  return {
    ...payload,
    id: createdUser.id || Date.now(),
    website: payload.website || '',
    company: {
      name: payload.company.name,
      catchPhrase: payload.company.catchPhrase || '',
      bs: payload.company.bs || '',
    },
    address: {
      street: payload.address.street,
      suite: payload.address.suite || '',
      city: payload.address.city,
      zipcode: payload.address.zipcode,
      geo: {
        lat: payload.address.geo?.lat || '',
        lng: payload.address.geo?.lng || '',
      },
    },
  };
}

/**
 * Update an existing user (PUT /users/:id)
 */
export async function updateContactApi(id: number, payload: ContactFormData): Promise<User> {
  // JSONPlaceholder supports PUT for existing demo IDs 1-10; if ID > 10 (locally created), we simulate network delay
  let apiSuccess = true;
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok && id <= 10) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    if (id <= 10) {
      throw err;
    }
    // If it was a mock-created ID > 10, JSONPlaceholder returns 500/404, which is expected behavior for typicode mock
    apiSuccess = false;
  }

  return {
    ...payload,
    id,
    website: payload.website || '',
    company: {
      name: payload.company.name,
      catchPhrase: payload.company.catchPhrase || '',
      bs: payload.company.bs || '',
    },
    address: {
      street: payload.address.street,
      suite: payload.address.suite || '',
      city: payload.address.city,
      zipcode: payload.address.zipcode,
      geo: {
        lat: payload.address.geo?.lat || '',
        lng: payload.address.geo?.lng || '',
      },
    },
  };
}

/**
 * Delete a user (DELETE /users/:id)
 */
export async function deleteContactApi(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (err) {
    console.warn(`DELETE /users/${id} call error:`, err);
    return true; // Still allow state removal
  }
}
