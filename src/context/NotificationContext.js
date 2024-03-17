import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = createContext();

const MAX_NOTIFICATIONS = 11; // Maximum number of notifications allowed
export const NotificationProvider = ({children}) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from AsyncStorage on component mount
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem(
        'tradelenda_notifications',
      );
      if (storedNotifications) {
        let parsedNotifications = JSON.parse(storedNotifications);
        parsedNotifications.sort((a, b) => b.id - a.id);
        setNotifications(parsedNotifications);
      }
    } catch (error) {}
  };

  const saveNotifications = async updatedNotifications => {
    try {
      let notificationsToSave = updatedNotifications;

      // Remove oldest notifications if count exceeds MAX_NOTIFICATIONS
      if (updatedNotifications.length > MAX_NOTIFICATIONS) {
        const diff = updatedNotifications.length - MAX_NOTIFICATIONS;
        notificationsToSave = updatedNotifications.slice(diff);
      }

      await AsyncStorage.setItem(
        'tradelenda_notifications',
        JSON.stringify(notificationsToSave),
      );
      setNotifications(notificationsToSave);
    } catch (error) {}
  };

  const addNotification = newNotification => {
    const updatedNotifications = [...notifications, newNotification];
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = id => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== id,
    );
    saveNotifications(updatedNotifications);
  };

  const updateNotification = (id, updatedProperties) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id) {
        return {...notification, ...updatedProperties};
      }
      return notification;
    });

    saveNotifications(updatedNotifications);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        deleteNotification,
        loadNotifications,
        updateNotification,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};
