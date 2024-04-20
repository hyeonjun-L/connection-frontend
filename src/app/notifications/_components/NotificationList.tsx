import NotificationItem from './NotificationItem';

const NotificationList = () => {
  return (
    <section className="flex flex-col bg-sub-color1-transparent px-4 pb-12 pt-3">
      <ul className="flex flex-col gap-3.5">
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
      </ul>
    </section>
  );
};

export default NotificationList;
