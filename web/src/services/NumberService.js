import axios from "axios";

class NumberService {
    generateNumbers = (totalNumbers) => {
        return axios.post(
            "http://localhost:5000/generate-numbers", {
                count: totalNumbers,
            }, {
                headers: {
                    "Content-type": "application/json; charset=utf-8",
                },
            }
        );
    };

    submitPlayerStats = (playerID, numbers, timeTaken) => {
        return axios.post("http://localhost:5000/submit", {
            playerID,
            rounds: 1,
            numbersProcessed: numbers.length,
            timeTaken,
        });
    };
}

export const numberService = new NumberService();