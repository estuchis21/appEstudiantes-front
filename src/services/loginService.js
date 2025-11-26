import apiClient from "./apiClient";

const loginService = async (data) => {
    try {
        const response = await apiClient("/session/login", {
            method: "POST",
            body: JSON.stringify(data),
        });

        return response; // ya es JSON

    } catch (error) {
        console.error("Error durante login:", error);
        throw error;
    }
};

export default loginService;
