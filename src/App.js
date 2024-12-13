import { Console, Random } from "@woowacourse/mission-utils";

const WINNING_PRICE = {
  first: 2000000000, // 6개 일치
  second: 30000000,  // 5개 + 보너스
  third: 1500000,    // 5개
  fourth: 50000,     // 4개
  fifth: 5000,       // 3개
};

class App {
  async run() {
    const BuyPrice = await this.getBuyPrice();
    const lottoNumbers = this.generateLottoNumbers(BuyPrice);
    this.printLottoNumbers(lottoNumbers);
    const { winNumbers, bonusNumber } = await this.getWinningNumbers();
    const results = this.calculateResults(lottoNumbers, winNumbers, bonusNumber);
    const profitRate = this.getProfitRate(results, BuyPrice * 1000);
    this.printResult(results, profitRate);
  }

  async getBuyPrice() {
    try {
      const InputPrice = await Console.readLineAsync("구입금액을 입력해주세요.\n");

      if (Number.isNaN(InputPrice) || Number(InputPrice) < 1000 || Number(InputPrice) % 1000 !== 0) {
        throw new Error("[ERROR] 올바른 금액(1000원 단위의 숫자)을 입력해주세요.");
      }
      const BuyPrice = Math.floor(InputPrice / 1000);
      Console.print(`\n${BuyPrice}개를 구매했습니다.`);
      return BuyPrice;
    } catch (e) {
      Console.print(e.message);
      return this.getBuyPrice();
    }
  }

  generateLottoNumbers(BuyPrice) {
    const lottoNumbers = [];
    for (let i = 0; i < BuyPrice; i++) {
      const randomNumbers = Random.pickUniqueNumbersInRange(1, 45, 6).sort((a, b) => a - b);
      lottoNumbers.push(randomNumbers);
    }
    return lottoNumbers;
  }

  printLottoNumbers(lottoNumbers) {
    lottoNumbers.forEach(numbers => {
      Console.print(`[${numbers.join(", ")}]`);
    });
  }

  async getWinningNumbers() {
    const winNumbersInput = await Console.readLineAsync("\n당첨 번호를 입력해주세요.\n");
    const bonusNumber = await Console.readLineAsync("보너스 번호를 입력해주세요.\n");
    const winNumbers = winNumbersInput.split(",").map(Number);
    // map(Number)을 사용하여 문자열 배열을 숫자형 배열로 변환합니다.
    return { winNumbers, bonusNumber: Number(bonusNumber) };
  }

  calculateResults(lottoNumbers, winNumbers, bonusNumber) {
    const lottoResult = { first: 0, second: 0, third: 0, fourth: 0, fifth: 0 };

    lottoNumbers.forEach((lotto) => {
      const correctCount = lotto.filter((number) => winNumbers.includes(number)).length;
      const bonus = lotto.includes(bonusNumber);

      if (correctCount === 3) lottoResult.fifth += 1;
      if (correctCount === 4) lottoResult.fourth += 1;
      if (correctCount === 5 && bonus) lottoResult.second += 1;
      if (correctCount === 5 && !bonus) lottoResult.third += 1;
      if (correctCount === 6) lottoResult.first += 1;
    });
    return lottoResult;
  }

  getProfitRate(lottoResult, purchasePrice) {
    let totalProfit = 0;

    for (const key in lottoResult) {
      totalProfit += lottoResult[key] * WINNING_PRICE[key];
    }
    return ((totalProfit / purchasePrice) * 100).toFixed(1);
  }

  printResult(results, profitRate) {
    Console.print("\n당첨 통계");
    Console.print("---");
    Console.print(`3개 일치 (5,000원) - ${results.fifth}개`);
    Console.print(`4개 일치 (50,000원) - ${results.fourth}개`);
    Console.print(`5개 일치 (1,500,000원) - ${results.third}개`);
    Console.print(`5개 일치, 보너스 볼 일치 (30,000,000원) - ${results.second}개`);
    Console.print(`6개 일치 (2,000,000,000원) - ${results.first}개`);
    Console.print(`총 수익률은 ${profitRate}%입니다.`);
  }
}

export default App;