const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;

export const post = async <BodyT, ResponseT>(
    endPoint: string,
    requestBody: BodyT
): Promise<ResponseT> => {
    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/${endPoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            }
        )

        if (!response.ok) {
            throw new Error("Response not ok.");
        }

        return (await response.json()) as ResponseT;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};
