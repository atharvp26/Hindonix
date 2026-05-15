export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  country: string;
  city: string;
  product?: string;
  subject?: string;
  message: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

function generateSubmissionId(): string {
  return `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const submitToGoogleSheets = async (
  formData: ContactFormData
): Promise<GoogleSheetsResponse> => {
  const webAppUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL;

  if (!webAppUrl) {
    throw new Error(
      "Google Sheets Web App URL not configured. Please set NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL in environment variables."
    );
  }

  const submissionData = {
    ...formData,
    timestamp: new Date().toISOString(),
    submissionId: generateSubmissionId(),
  };

  const params = new URLSearchParams();
  Object.entries(submissionData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const response = await fetch(webAppUrl, {
    method: "POST",
    body: params,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return {
    success: result.success || true,
    message: result.message || "Form submitted successfully",
    submissionId: submissionData.submissionId,
  };
};

export const submitToGoogleSheetsWithRetry = async (
  formData: ContactFormData,
  maxRetries: number = 2
): Promise<GoogleSheetsResponse> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await submitToGoogleSheets(formData);
    } catch (error) {
      lastError = error as Error;
      if (error instanceof Error && error.message.includes("not configured")) {
        throw error;
      }
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError || new Error("Failed to submit form after retries");
};
