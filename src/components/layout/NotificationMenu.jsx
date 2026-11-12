import Dropdown, { MenuItem, MenuSeparator, MenuTitle } from '../ui/Dropdown';
import IconButton from '../ui/IconButton';
import { NOTIFICATIONS } from '../../mock';

export default function NotificationMenu({ notifications = NOTIFICATIONS, onMarkAllRead }) {
  const unread = notifications.filter((n) => n.unread).length;
  return (
    <Dropdown width={340} trigger={({ open, toggle }) => (
      <IconButton icon="bell" label="Notifications" badge={unread} aria-expanded={open} onClick={toggle} />
    )}>
      {(close) => (
        <>
          <MenuTitle>Notifications</MenuTitle>
          {notifications.length === 0 && <div className="menu-title">Aucune notification</div>}
          {notifications.map((n) => (
            <MenuItem key={n.id} icon={n.icon} className={`notif-item${n.unread ? ' unread' : ''}`} onClick={close}>
              <span><b style={{ fontWeight: 500 }}>{n.title}</b><small>{n.text}</small><small>{n.time}</small></span>
            </MenuItem>
          ))}
          <MenuSeparator />
          <MenuItem icon="check2-all" onClick={() => { onMarkAllRead?.(); close(); }}>Tout marquer comme lu</MenuItem>
        </>
      )}
    </Dropdown>
  );
}
