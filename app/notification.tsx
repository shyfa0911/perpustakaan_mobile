import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'approved',
      title: 'Peminjaman Disetujui',
      message: 'Buku "Bumi Manusia" berhasil dipinjam',
      book: 'Bumi Manusia',
      time: 'Baru saja',
      read: false,
    },
    {
      id: '2',
      type: 'rejected',
      title: 'Peminjaman Ditolak',
      message: 'Buku "Cantik Itu Luka" sedang dipinjam orang lain',
      book: 'Cantik Itu Luka',
      time: '1 jam yang lalu',
      read: false,
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Pengingat Pengembalian',
      message: 'Buku "Laut Bercerita" harus dikembalikan besok',
      book: 'Laut Bercerita',
      time: 'Hari ini, 10:30',
      read: true,
    },
    {
      id: '4',
      type: 'approved',
      title: 'Peminjaman Disetujui',
      message: 'Buku "Atomic Habits" berhasil dipinjam',
      book: 'Atomic Habits',
      time: 'Kemarin, 15:45',
      read: true,
    },
    {
      id: '5',
      type: 'returned',
      title: 'Buku Dikembalikan',
      message: 'Buku "The Psychology of Money" sudah dikembalikan',
      book: 'The Psychology of Money',
      time: '2 hari yang lalu',
      read: true,
    },
    {
      id: '6',
      type: 'overdue',
      title: 'Keterlambatan',
      message: 'Buku "Deep Work" terlambat 2 hari',
      book: 'Deep Work',
      time: '3 hari yang lalu',
      read: true,
    },
  ]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Get icon berdasarkan tipe notifikasi
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approved':
        return { icon: 'checkmark-circle', color: '#10B981' };
      case 'rejected':
        return { icon: 'close-circle', color: '#EF4444' };
      case 'reminder':
        return { icon: 'alarm', color: '#3B82F6' };
      case 'returned':
        return { icon: 'return-up-back', color: '#8B5CF6' };
      case 'overdue':
        return { icon: 'alert-circle', color: '#F59E0B' };
      default:
        return { icon: 'notifications', color: '#6B7280' };
    }
  };

  // Mark as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Tandai semua terbaca</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Notifikasi */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleLeft}>
          <Ionicons name="notifications" size={22} color="#3B82F6" />
          <Text style={styles.toggleLabel}>Aktifkan Notifikasi</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
          thumbColor={notificationsEnabled ? '#3B82F6' : '#9CA3AF'}
        />
      </View>

      {/* List Notifikasi */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const icon = getNotificationIcon(item.type);
          
          return (
            <TouchableOpacity 
              style={[styles.notifCard, !item.read && styles.notifUnread]}
              onPress={() => markAsRead(item.id)}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                <Ionicons name={icon.icon as any} size={24} color={icon.color} />
              </View>

              {/* Content */}
              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.bookText}>Buku: {item.book}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Tidak ada notifikasi</Text>
            <Text style={styles.emptyText}>Semua notifikasi sudah dibaca</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  markAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notifCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  notifUnread: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 8,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  notifMessage: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
    lineHeight: 20,
  },
  bookText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});