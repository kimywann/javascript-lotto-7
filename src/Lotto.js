class Lotto {
  #numbers;

  constructor(numbers) {
    this.#validate(numbers);
    this.#numbers = numbers;
  }

  #validate(numbers) {
    if (numbers.length !== 6) {
      throw new Error("[ERROR] 로또 번호는 6개여야 합니다.");
    }

    const uniqueNum = new Set(numbers);
    if (uniqueNum.size !== numbers.length) {
      throw new Error("[ERROR]");
    }
  }

  // TODO: 추가 기능 구현
}

export default Lotto;
