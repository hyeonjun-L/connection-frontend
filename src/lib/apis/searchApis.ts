import createParams from '@/utils/createParams';
import { searchClass, searchClassParameters } from '@/types/class';
import {
  searchInstructor,
  searchInstructorParameters,
} from '@/types/instructor';
import { searchPass, searchPassesParameters } from '@/types/pass';
import { FetchError } from '@/types/types';

export const deleteSearchKeyword = async (historyId: number) => {
  const response = await fetch(
    `/api/users/delete-keyword?historyId=${historyId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );

  return response;
};

export const deleteAllSearchKeywords = async () => {
  const response = await fetch('/api/users/delete-all-keywords', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
};

export const searchInstructors = async (
  data: searchInstructorParameters,
): Promise<searchInstructor[]> => {
  try {
    const params = createParams(data);

    const response = await fetch(`/api/instructors/search?${params}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const resData = await response.json();
    return resData.data.lecturerList ?? [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchClasses = async (
  data: searchClassParameters,
): Promise<searchClass[]> => {
  try {
    const params = createParams(data);

    const response = await fetch(`/api/class/search?${params}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const resData = await response.json();
    return resData.data.lectureList ?? [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchPasses = async (
  data: searchPassesParameters,
  userState: boolean,
): Promise<searchPass[]> => {
  try {
    const params = createParams(data);

    const response = await fetch(`/api/pass/search?${params}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        userState: `${userState}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: FetchError = new Error(errorData.message || '');
      error.status = response.status;
      throw error;
    }

    const resData = await response.json();
    return resData.data.searchedPassList ?? [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
