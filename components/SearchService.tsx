import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchServiceProps {
  onSearch: (text: string) => void;
}

const SearchService: React.FC<SearchServiceProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    onSearch(text);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="search" size={20} color="#FFA500" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Search any services..."
          value={searchTerm}
          onChangeText={handleSearch}
          placeholderTextColor="#000"
          
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
  },
  iconContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 50,
    padding: 15,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight : 'bold',
    letterSpacing: 0.8,
  },
});

export default SearchService;
