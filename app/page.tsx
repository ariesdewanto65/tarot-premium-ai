const shuffleDeck = () => {

  const deck: string[] = [];

  let majorCount = 0;

  for (let i = 0; i < 9; i++) {

    const allowMajor =
      majorCount < 1;

    const isMajor =
      allowMajor &&
      Math.random() < 0.35;

    if (isMajor) {

      const randomMajor =
        majorArcana[
          Math.floor(
            Math.random() *
              majorArcana.length
          )
        ];

      deck.push(randomMajor);

      majorCount++;

    } else {

      const randomMinor =
        minorArcana[
          Math.floor(
            Math.random() *
              minorArcana.length
          )
        ];

      deck.push(randomMinor);

    }

  }

  deck.sort(() => Math.random() - 0.5);

  setShuffledDeck(deck);
};