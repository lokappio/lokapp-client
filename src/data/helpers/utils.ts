export function groupBy<T>(items: any[], key: string): {[key: string]: T} {
  return items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }),
    {},
  );
}