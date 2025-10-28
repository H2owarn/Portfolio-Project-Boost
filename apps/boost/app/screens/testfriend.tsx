import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, useColorScheme, } from 'react-native';
import { useRelationships } from '@/contexts/FriendContext';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';

export default function FriendTestScreen() {
  const [searchName, setSearchName] = useState('');
  const [foundUserId, setFoundUserId] = useState<string | null>(null);
  const palette = Colors[useColorScheme() ?? 'dark'];

  const {
    friends,
    rivals,
    requests,
    sendRequest,
    acceptRequest,
    removeRelationship,
    fetchRelationships,
    fetchPendingRequests,
  } = useRelationships();

  useEffect(() => {
    fetchRelationships();
    fetchPendingRequests();
  }, []);

  // Helper: Find us er by name
  const findUserIdByName = async (username: string): Promise<string | null> => {
    if (!username.trim()) {
      Alert.alert('Enter a name first');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name')
      .ilike('name', username.trim());

    if (error || !data || data.length === 0) {
      Alert.alert('User not found');
      return null;
    }

    if (data.length > 1) {
      Alert.alert('Multiple users found', 'Please refine your search.');
      return null;
    }

    setFoundUserId(data[0].id);
    return data[0].id;
  };

  const handleSendFriend = async () => {
  const id = await findUserIdByName(searchName);
  if (!id) {
    Alert.alert('User not found', 'No user exists with that name.');
    return;
  }

  const success = await sendRequest(id, 'friend');

  if (success) {
    Alert.alert('Friend request sent!');
  } else {
    Alert.alert('Already added', 'You already have a pending or accepted request with this user.');
  }
};


  const handleSendRival = async () => {
  const id = await findUserIdByName(searchName);
  if (!id) return;

  const success = await sendRequest(id, 'rival');

  if (success) {
    Alert.alert('Rival request sent!');
  } else {
    Alert.alert('Already added', 'You already have a request or relationship with this user.');
  }
};


  const handleRemoveFriend = async () => {
    const id = await findUserIdByName(searchName);
    if (id) {
      await removeRelationship(id, 'friend');
      Alert.alert('Friend removed.');
    }
  };

  const handleRemoveRival = async () => {
    const id = await findUserIdByName(searchName);
    if (id) {
      await removeRelationship(id, 'rival');
      Alert.alert('Rival removed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: palette.text }]}>
        Friend System Test
      </Text>

      <TextInput
        placeholder="Enter username"
        value={searchName}
        onChangeText={setSearchName}
        style={[styles.input, { color: palette.text }]}
      />

      <Button title="Send Friend Request" onPress={handleSendFriend} />
      <Button title="Send Rival Request" onPress={handleSendRival} />
      <Button title="Remove Friend" onPress={handleRemoveFriend} />
      <Button title="Remove Rival" onPress={handleRemoveRival} />

      {/* Pending Requests */}
      <Text style={[styles.sectionTitle, { color: palette.text }]}>
        Pending Requests:
      </Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const fromName = item.user_1?.name ?? item.user_1_id;
          return (
            <View style={styles.card}>
              <Text style={{ color: palette.text }}>From: {fromName}</Text>
              <Text style={{ color: palette.text }}>Type: {item.type}</Text>
              <Button
                title="Accept"
                onPress={() => acceptRequest(String(item.id))}
              />
            </View>
          );
        }}
      />

      {/* Friends */}
      <Text style={[styles.sectionTitle, { color: palette.text }]}>
        Friends:
      </Text>
      {friends.length === 0 ? (
        <Text style={{ color: palette.text }}>No friends yet</Text>
      ) : (
        friends.map((friend) => (
          <Text key={friend.id} style={{ color: palette.text }}>
            {friend.name ?? friend.id}
          </Text>
        ))
      )}

      {/* Rivals */}
      <Text style={[styles.sectionTitle, { color: palette.text }]}>
        Rivals:
      </Text>
      {rivals.length === 0 ? (
        <Text style={{ color: palette.text }}>No rivals yet</Text>
      ) : (
        rivals.map((rival) => (
          <Text key={rival.id} style={{ color: palette.text }}>
            {rival.name ?? rival.id}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
    borderRadius: 6,
  },
});
