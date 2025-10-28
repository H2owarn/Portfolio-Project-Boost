import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, useColorScheme, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useRelationships } from '@/contexts/FriendContext';
import { supabase } from '@/lib/supabase';
import { Colors, Radii } from '@/constants/theme';
import { BoostInput } from '@/components/boost-input';

export default function FriendTestScreen() {
  const [searchName, setSearchName] = useState('');
  const palette = Colors[useColorScheme() ?? 'dark'];
  const router = useRouter();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: Find user by name
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

    return data[0].id;
  };

  const handleSendFriend = async () => {
    const id = await findUserIdByName(searchName);
    if (id) {
      await sendRequest(id, 'friend');
      Alert.alert('Success', 'Friend request sent!');
      setSearchName('');
    }
  };

  const handleSendRival = async () => {
    const id = await findUserIdByName(searchName);
    if (id) {
      await sendRequest(id, 'rival');
      Alert.alert('Success', 'Rival request sent!');
      setSearchName('');
    }
  };

  const handleRemoveFriend = async () => {
    const id = await findUserIdByName(searchName);
    if (id) {
      await removeRelationship(id, 'friend');
      Alert.alert('Success', 'Friend removed.');
      setSearchName('');
    }
  };

  const handleRemoveRival = async () => {
    const id = await findUserIdByName(searchName);
    if (id) {
      await removeRelationship(id, 'rival');
      Alert.alert('Success', 'Rival removed.');
      setSearchName('');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        {/* Top Navigation Bar */}
        <View style={[styles.topNav, { backgroundColor: palette.background }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={palette.text} />
            <Text style={[styles.backText, { color: palette.text }]}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: palette.surface }]}>
              <View style={[styles.iconContainer, { backgroundColor: palette.surfaceElevated }]}>
                <MaterialIcons name="people" size={32} color={palette.primary} />
              </View>
              <Text style={[styles.title, { color: palette.text }]}>Friends & Rivals</Text>
              <Text style={[styles.subtitle, { color: palette.mutedText }]}>
                Manage your friends and rivals
              </Text>
            </View>

        {/* Search Section */}
        <View style={[styles.section, { backgroundColor: palette.surface }]}>
          <BoostInput
            placeholder="Enter username"
            value={searchName}
            onChangeText={setSearchName}
            leadingIcon={{ name: 'search' }}
            autoCapitalize="none"
          />

          {/* 2x2 Button Grid */}
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.gridButton, { backgroundColor: palette.surfaceElevated }]}
                onPress={handleSendFriend}
              >
                <Text style={[styles.gridButtonLabel, { color: palette.primary }]}>Send Friend Request</Text>
              </Pressable>

              <Pressable
                style={[styles.gridButton, { backgroundColor: palette.surfaceElevated }]}
                onPress={handleSendRival}
              >
                <Text style={[styles.gridButtonLabel, { color: palette.primary }]}>Send Rival Request</Text>
              </Pressable>
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.gridButton, { backgroundColor: palette.surfaceElevated }]}
                onPress={handleRemoveFriend}
              >
                <Text style={[styles.gridButtonLabel, { color: palette.primary }]}>Remove Friend</Text>
              </Pressable>

              <Pressable
                style={[styles.gridButton, { backgroundColor: palette.surfaceElevated }]}
                onPress={handleRemoveRival}
              >
                <Text style={[styles.gridButtonLabel, { color: palette.primary }]}>Remove Rival</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Pending Requests - Always show */}
        <View style={[styles.section, { backgroundColor: palette.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="notifications" size={18} color={palette.primary} />
            <Text style={[styles.sectionTitle, { color: palette.text }]}>
              Pending Requests:
            </Text>
            {requests.length > 0 && (
              <View style={[styles.badge, { backgroundColor: palette.primary }]}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            )}
          </View>
          
          {requests.length === 0 ? (
            <Text style={[styles.emptyText, { color: palette.mutedText, textAlign: 'left', padding: 10 }]}>
              No pending requests
            </Text>
          ) : (
            requests.map((item) => {
              const fromName = item.user_1?.name ?? item.user_1_id;
              return (
                <View key={item.id} style={[styles.card, { backgroundColor: palette.surfaceElevated }]}>
                  <View style={styles.cardContent}>
                    <View style={[styles.avatar, { backgroundColor: palette.surface }]}>
                      <MaterialIcons name="person" size={20} color={palette.primary} />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardName, { color: palette.text }]}>{fromName}</Text>
                      <View style={styles.typeTag}>
                        <MaterialIcons 
                          name={item.type === 'friend' ? 'favorite' : 'flash-on'} 
                          size={12} 
                          color={palette.mutedText} 
                        />
                        <Text style={[styles.cardType, { color: palette.mutedText }]}>
                          {item.type}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={[styles.acceptButton, { backgroundColor: palette.primary }]}
                    onPress={() => acceptRequest(String(item.id))}
                  >
                    <MaterialIcons name="check" size={18} color="#000" />
                  </Pressable>
                </View>
              );
            })
          )}
        </View>

        {/* Friends and Rivals in Grid */}
        <View style={styles.gridContainer}>
          {/* Friends */}
          <View style={[styles.gridSection, { backgroundColor: palette.surface }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="group" size={18} color={palette.primary} />
              <Text style={[styles.sectionTitle, { color: palette.text }]}>Friends</Text>
              {friends.length > 0 && (
                <View style={[styles.badge, { backgroundColor: palette.surfaceElevated }]}>
                  <Text style={[styles.badgeText, { color: palette.primary }]}>{friends.length}</Text>
                </View>
              )}
            </View>
            
            {friends.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="person-outline" size={32} color={palette.mutedText} />
                <Text style={[styles.emptyText, { color: palette.mutedText }]}>No friends</Text>
              </View>
            ) : (
              friends.slice(0, 3).map((friend) => (
                <View key={friend.id} style={[styles.listItem, { backgroundColor: palette.surfaceElevated }]}>
                  <View style={[styles.smallAvatar, { backgroundColor: palette.surface }]}>
                    <MaterialIcons name="person" size={16} color={palette.primary} />
                  </View>
                  <Text style={[styles.listItemName, { color: palette.text }]} numberOfLines={1}>
                    {friend.name ?? friend.id}
                  </Text>
                </View>
              ))
            )}
            {friends.length > 3 && (
              <Text style={[styles.moreText, { color: palette.mutedText }]}>
                +{friends.length - 3} more
              </Text>
            )}
          </View>

          {/* Rivals */}
          <View style={[styles.gridSection, { backgroundColor: palette.surface }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="flash-on" size={18} color={palette.primary} />
              <Text style={[styles.sectionTitle, { color: palette.text }]}>Rivals</Text>
              {rivals.length > 0 && (
                <View style={[styles.badge, { backgroundColor: palette.surfaceElevated }]}>
                  <Text style={[styles.badgeText, { color: palette.primary }]}>{rivals.length}</Text>
                </View>
              )}
            </View>
            
            {rivals.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="flash-off" size={32} color={palette.mutedText} />
                <Text style={[styles.emptyText, { color: palette.mutedText }]}>No rivals</Text>
              </View>
            ) : (
              rivals.slice(0, 3).map((rival) => (
                <View key={rival.id} style={[styles.listItem, { backgroundColor: palette.surfaceElevated }]}>
                  <View style={[styles.smallAvatar, { backgroundColor: palette.surface }]}>
                    <MaterialIcons name="person" size={16} color={palette.primary} />
                  </View>
                  <Text style={[styles.listItemName, { color: palette.text }]} numberOfLines={1}>
                    {rival.name ?? rival.id}
                  </Text>
                </View>
              ))
            )}
            {rivals.length > 3 && (
              <Text style={[styles.moreText, { color: palette.mutedText }]}>
                +{rivals.length - 3} more
              </Text>
            )}
          </View>
        </View>
        </View>
      </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 0,
    gap: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    gap: 6,
    borderRadius: Radii.lg,
    padding: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  section: {
    borderRadius: Radii.lg,
    padding: 12,
    gap: 10,
  },
  textButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGrid: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gridButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radii.md,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: Radii.md,
    gap: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardType: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  gridSection: {
    flex: 1,
    borderRadius: Radii.lg,
    padding: 12,
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: Radii.md,
    gap: 8,
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  moreText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
