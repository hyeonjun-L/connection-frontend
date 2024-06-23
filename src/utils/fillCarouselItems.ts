interface fillCarouselItemsProps {
  items: any[];
  minItems: number;
}

const fillCarouselItems = ({
  items,
  minItems,
}: fillCarouselItemsProps): any[] => {
  const result = [...items];

  while (result.length > 0 && result.length < minItems) {
    result.push(...items);
  }

  return result;
};

export default fillCarouselItems;
