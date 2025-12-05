// app/Home/Wishlist.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import booksJSON from '@/data.json';

const Wishlist = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistBooks, setWishlistBooks] = useState<any[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // Load wishlist dari AsyncStorage saat komponen mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');
      if (savedWishlist) {
        const wishlistArray = JSON.parse(savedWishlist);
        setWishlist(wishlistArray);
        
        // Filter buku yang ada di wishlist
        const filteredBooks = booksJSON.books.filter(book => 
          wishlistArray.includes(book.id)
        );
        setWishlistBooks(filteredBooks);
      }
    } catch (error) {
      console.log('Error loading wishlist:', error);
    }
  };

  // Toggle select mode
  const toggleSelectMode = () => {
    if (isSelectMode) {
      // Keluar dari select mode, reset selected books
      setSelectedBooks([]);
    }
    setIsSelectMode(!isSelectMode);
  };

  // Toggle pilih buku
  const toggleSelectBook = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      // Unselect buku
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      // Select buku
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  // Select all books
  const selectAllBooks = () => {
    if (selectedBooks.length === wishlistBooks.length) {
      // Unselect all
      setSelectedBooks([]);
    } else {
      // Select all
      setSelectedBooks(wishlistBooks.map(book => book.id));
    }
  };

  // Hapus buku yang dipilih
  const deleteSelectedBooks = () => {
    if (selectedBooks.length === 0) return;
    
    setDeleteModalVisible(true);
  };

  const confirmDeleteSelected = async () => {
    try {
      // Filter wishlist untuk menghapus buku yang dipilih
      const updatedWishlist = wishlist.filter(id => !selectedBooks.includes(id));
      setWishlist(updatedWishlist);
      await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      // Update daftar buku
      const filteredBooks = booksJSON.books.filter(book => 
        updatedWishlist.includes(book.id)
      );
      setWishlistBooks(filteredBooks);
      
      // Reset selection
      setSelectedBooks([]);
      setIsSelectMode(false);
      setDeleteModalVisible(false);
    } catch (error) {
      console.log('Error deleting selected books:', error);
    }
  };

  // Hapus semua wishlist
  const clearAllWishlist = () => {
    Alert.alert(
      "Hapus Semua Wishlist",
      "Yakin ingin menghapus semua buku dari wishlist?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus Semua", 
          style: "destructive",
          onPress: async () => {
            try {
              setWishlist([]);
              setWishlistBooks([]);
              await AsyncStorage.removeItem('wishlist');
            } catch (error) {
              console.log('Error clearing wishlist:', error);
            }
          }
        }
      ]
    );
  };

  // Hapus single book (biasa, bukan select mode)
  const removeFromWishlist = async (bookId: string) => {
    Alert.alert(
      "Hapus dari Wishlist",
      "Yakin ingin menghapus buku ini dari wishlist?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: async () => {
            try {
              const updatedWishlist = wishlist.filter(id => id !== bookId);
              setWishlist(updatedWishlist);
              await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
              
              const filteredBooks = booksJSON.books.filter(book => 
                updatedWishlist.includes(book.id)
              );
              setWishlistBooks(filteredBooks);
            } catch (error) {
              console.log('Error removing from wishlist:', error);
            }
          }
        }
      ]
    );
  };

  const navigateToDetail = (bookId: string) => {
    if (isSelectMode) {
      // Jika dalam mode select, toggle selection
      toggleSelectBook(bookId);
    } else {
      // Jika tidak, navigasi ke detail
      router.push(`/Home/detail?bookId=${bookId}`);
    }
  };

  const renderBookItem = ({ item }: { item: any }) => {
    const isSelected = selectedBooks.includes(item.id);

    return (
      <TouchableOpacity 
        style={[
          styles.bookCard,
          isSelected && styles.selectedBookCard
        ]}
        onPress={() => navigateToDetail(item.id)}
        activeOpacity={0.7}
        onLongPress={() => {
          if (!isSelectMode) {
            setIsSelectMode(true);
            toggleSelectBook(item.id);
          }
        }}
      >
        {/* Checkbox/Selection Indicator */}
        {isSelectMode && (
          <View style={[
            styles.checkboxContainer,
            isSelected && styles.checkboxSelected
          ]}>
            {isSelected && (
              <Icon name="check" size={16} color="white" />
            )}
          </View>
        )}

        {/* Wishlist Indicator */}
        {!isSelectMode && (
          <View style={styles.wishlistIndicator}>
            <Icon name="heart" size={16} color="#FF4081" />
          </View>
        )}

        <Image
          source={{ uri: item.cover }}
          style={[
            styles.bookCover,
            isSelected && styles.selectedBookCover
          ]}
          resizeMode="cover"
        />
        
        <View style={styles.bookInfo}>
          <View style={styles.bookHeader}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {item.judul || item.title}
            </Text>
            {!isSelectMode && (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(item.id);
                }}
              >
                <Icon name="close" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.penulis || item.author}
          </Text>
          
          <View style={styles.bookMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.kategori || item.category}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
            </View>
          </View>
          
          <View style={styles.difficultyContainer}>
            <Text style={styles.readingTime}>{item.readingTime || "8-10 jam"}</Text>
            <View style={[
              styles.difficultyBadge,
              { 
                backgroundColor: (item.difficulty === 'Mudah' || !item.difficulty) ? '#4CAF50' :
                                item.difficulty === 'Sedang' ? '#FF9800' : '#F44336'
              }
            ]}>
              <Text style={styles.difficultyText}>{item.difficulty || "Mudah"}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (wishlistBooks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={80} color="#ddd" />
          <Text style={styles.emptyTitle}>Wishlist Kosong</Text>
          <Text style={styles.emptyText}>
            Tambahkan buku favorit ke wishlist untuk membaca nanti
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/Home/Dashboard')}
          >
            <Text style={styles.browseButtonText}>Jelajahi Buku</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Modal Konfirmasi Hapus yang Dipilih */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="alert-circle-outline" size={60} color="#FF6B6B" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>
              Hapus {selectedBooks.length} Buku
            </Text>
            <Text style={styles.modalText}>
              Yakin ingin menghapus {selectedBooks.length} buku yang dipilih dari wishlist?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteSelected}
              >
                <Text style={styles.deleteButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (isSelectMode) {
              setIsSelectMode(false);
              setSelectedBooks([]);
            } else {
              router.back();
            }
          }}
        >
          <Icon 
            name={isSelectMode ? "close" : "arrow-left"} 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {isSelectMode ? `Pilih (${selectedBooks.length})` : 'Wishlist Saya'}
        </Text>
        
        <View style={styles.headerActions}>
          {isSelectMode ? (
            <>
              {selectedBooks.length > 0 && (
                <TouchableOpacity 
                  style={styles.deleteSelectedButton}
                  onPress={deleteSelectedBooks}
                >
                  <Icon name="delete" size={22} color="#FF6B6B" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={toggleSelectMode}
              >
                <Icon name="checkbox-multiple-marked-outline" size={22} color="#4a90e2" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={clearAllWishlist}
              >
                <Icon name="delete-sweep" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      {/* Selection Toolbar */}
      {isSelectMode && (
        <View style={styles.selectionToolbar}>
          <TouchableOpacity 
            style={styles.selectAllButton}
            onPress={selectAllBooks}
          >
            <View style={[
              styles.toolbarCheckbox,
              selectedBooks.length === wishlistBooks.length && styles.toolbarCheckboxSelected
            ]}>
              {selectedBooks.length === wishlistBooks.length && (
                <Icon name="check" size={14} color="white" />
              )}
            </View>
            <Text style={styles.selectAllText}>
              {selectedBooks.length === wishlistBooks.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.selectedCount}>
            {selectedBooks.length} dipilih
          </Text>
        </View>
      )}
      
      {/* Regular Info Bar */}
      {!isSelectMode && (
        <View style={styles.infoBar}>
          <View style={styles.wishlistCount}>
            <Icon name="heart" size={16} color="#FF4081" />
            <Text style={styles.countText}>{wishlistBooks.length} buku</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.clearTextButton}
            onPress={clearAllWishlist}
          >
            <Text style={styles.clearText}>Hapus Semua</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={wishlistBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  clearAllButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
  },
  deleteSelectedButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
  },
  selectionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4a90e2',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolbarCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarCheckboxSelected: {
    backgroundColor: 'white',
    borderColor: '#4a90e2',
  },
  selectAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  wishlistCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 14,
    color: '#FF4081',
    fontWeight: '600',
    marginLeft: 6,
  },
  clearTextButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedBookCard: {
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  checkboxContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a90e2',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  wishlistIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCover: {
    width: 100,
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  selectedBookCover: {
    opacity: 0.8,
  },
  bookInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  removeButton: {
    padding: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  categoryBadge: {
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingTime: {
    fontSize: 12,
    color: '#666',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: '#4f86f7',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default Wishlist;