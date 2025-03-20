import { useMutation, useQueryClient } from 'react-query';

const sendData = async (url: string, method: string, data: any) => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Get raw response as text first
    const textResponse = await response.text();
    console.log('🔹 Raw API Response:', textResponse);

    // Check if the response is a valid JSON string
    let responseData;
    try {
      responseData = JSON.parse(textResponse);
      console.log('✅ Parsed JSON Response:', responseData);
    } catch (error) {
      // If parsing fails, it's likely a plain text response
      responseData = { success: false, message: textResponse }; 
    }

    // Handle non-OK responses
    if (!response.ok) {
      return { success: false, message: responseData?.message || 'Network response was not ok' };
    }

    // Return the response JSON if successful
    return { success: true, data: responseData };
  } catch (error) {
    // Log and handle network errors
    return { success: false, message: 'Network error. Please check your connection.' };
  }
};


// Reusable hook for POST/PUT/DELETE requests
export const useMutateData = (url: string, method: string, data?: any) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (newData: any) => sendData(url, method, newData || data),
    {
      onSuccess: (response) => {
        // Optionally, invalidate query caches for the related data
        queryClient.invalidateQueries(url);

        // No logging or side effects, just handle success response here
        if (response.success) {
          // Success response handling (return data, call further functions, etc.)
          return response.data;
        } else {
          // Error response handling (return error message, call error handlers, etc.)
          return response.message;
        }
      },
      onError: (error: any) => {
        // Handle errors, return the error message for the calling component to manage
        return error.message;
      },
    }
  );
};