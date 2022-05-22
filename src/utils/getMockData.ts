import { faker } from '@faker-js/faker';

const getItem = () => ({
  id: faker.unique(() => faker.random.alphaNumeric(10)),
  label: faker.system.directoryPath(),
  children: [],
});

export const getMockData = (objectsOnFirstLevel: number) => {
  const result = [];

  for (let i = 0; i < objectsOnFirstLevel; i++) {
    const demoObj = {
      ...getItem(),
      children: Array.from({ length: 5 }, () => {
        return {
          ...getItem(),
          children: Math.random() > 0.5 ? [] : [getItem()],
        };
      }),
    };

    result.push(demoObj);
  }

  return result;
};
