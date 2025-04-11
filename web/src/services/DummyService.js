class DummyService {
    generateNumbers = (digit, number, includeNegativeNumber) => {
        const numbers = [];
        let total = 0;
        const { min, max } = this.getBoundary(digit, includeNegativeNumber);
        for (let i = 0; i < number; i++) {
            let num = 0;
            while (num == 0 || (num < 0 && Math.abs(num) > total)) {
                num = this.getRandomArbitrary(min, max);
            }

            if (num < 0 && Math.abs(num) > total) {
                num = -total;
            }
            total += num;
            numbers.push(num);
        }
        return {
            numbers,
            final_result: total,
        };
    };

    getRandomArbitrary = (min, max) => {
        return Math.trunc(Math.random() * (max - min) + min);
    };

    getBoundary(digit, includeNegativeNumber) {
        let bound = 1 * Math.pow(10, digit);

        return {
            min: includeNegativeNumber ? bound * -1 : 1,
            max: bound,
        };
    }
}

export const dummyService = new DummyService();