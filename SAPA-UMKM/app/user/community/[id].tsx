import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { addComment, fetchComments, getCommunityPosts, likeComment, likePost } from '@/lib/api';

const palette = {
    light: {
        background: '#F5F7FB',
        surface: '#FFFFFF',
        primary: '#1B5CC4',
        accent: '#15B79F',
        text: '#0F1B3A',
        subtle: '#66728F',
        border: '#E1E6F3',
        badge: 'rgba(27, 92, 196, 0.12)',
        success: '#16A34A',
    },
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        primary: '#3B82F6',
        accent: '#34D399',
        text: '#F8FAFC',
        subtle: '#94A3B8',
        border: '#273449',
        badge: 'rgba(59, 130, 246, 0.16)',
        success: '#22C55E',
    },
};

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const scheme = useColorScheme();
    const colors = scheme === 'dark' ? palette.dark : palette.light;
    const { user } = useAuth();

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [replyTo, setReplyTo] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch post detail
            const posts = await getCommunityPosts(user?.token, user?.id?.toString());
            const currentPost = posts.find((p: any) => p.id.toString() === id?.toString());
            setPost(currentPost);

            // Fetch comments
            const postComments = await fetchComments(id as string, user?.id?.toString());
            setComments(postComments);
        } catch (error) {
            console.error('Error loading post detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLikePost = async () => {
        if (!user?.token || !post) return;
        try {
            const res = await likePost(user.token, post.id);
            if (res.success) {
                setPost((prev: any) => ({
                    ...prev,
                    likes: res.liked ? (prev.likes || 0) + 1 : (prev.likes || 0) - 1,
                    is_liked: res.liked,
                }));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleLikeComment = async (commentId: number) => {
        if (!user?.token) return;
        try {
            const res = await likeComment(user.token, commentId);
            if (res.success) {
                setComments((prev) =>
                    prev.map((c) =>
                        c.id === commentId
                            ? {
                                ...c,
                                likes: res.liked ? (c.likes || 0) + 1 : (c.likes || 0) - 1,
                                is_liked: res.liked,
                            }
                            : c
                    )
                );
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleSubmitComment = async () => {
        if (!user?.token || !commentText.trim()) return;
        setSubmitting(true);
        try {
            const res = await addComment(user.token, id as string, {
                content: commentText,
                parent_comment_id: replyTo?.id || null,
            });
            if (res.success) {
                setCommentText('');
                setReplyTo(null);
                const updatedComments = await fetchComments(id as string, user?.id?.toString());
                setComments(updatedComments);
            }
        } catch (error) {
            Alert.alert('Error', 'Gagal mengirim komentar');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSharePost = () => {
        if (!post) return;
        Share.share({
            message: `[SAPA UMKM Komunitas]\n\n${post.author_name} berbagi: "${post.title || post.content.substring(0, 50)}..."\n\nBaca selengkapnya di aplikasi SAPA UMKM!`,
        });
    };

    const handleShareComment = (comment: any) => {
        Share.share({
            message: `[Komentar di SAPA UMKM]\n\n${comment.author_name} berkata: "${comment.content}"\n\nDiskusi tentang: ${post?.title || 'Pengembangan UMKM'}`,
        });
    };

    if (loading && !post) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!post) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.subtle }}>Postingan tidak ditemukan</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: colors.primary }}>Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderComment = ({ item }: { item: any }) => {
        const isReply = !!item.parent_comment_id;
        return (
            <View style={[styles.commentCard, { marginLeft: isReply ? 32 : 0, borderLeftColor: isReply ? colors.border : 'transparent', borderLeftWidth: isReply ? 2 : 0 }]}>
                <View style={styles.commentHeader}>
                    <View style={[styles.avatarSmall, { backgroundColor: `${colors.primary}10` }]}>
                        <Feather name="user" size={14} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.authorName, { color: colors.text }]}>{item.author_name}</Text>
                        <Text style={[styles.dateText, { color: colors.subtle }]}>
                            {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.commentContent, { color: colors.text }]}>{item.content}</Text>

                <View style={styles.commentActions}>
                    <TouchableOpacity onPress={() => handleLikeComment(item.id)} style={styles.actionBtn}>
                        <Feather name="heart" size={14} color={item.is_liked ? '#EF4444' : colors.subtle} style={item.is_liked && { fill: '#EF4444' } as any} />
                        <Text style={[styles.actionText, { color: item.is_liked ? '#EF4444' : colors.subtle }]}>{item.likes || 0}</Text>
                    </TouchableOpacity>

                    {!isReply && (
                        <TouchableOpacity
                            onPress={() => {
                                setReplyTo(item);
                                inputRef.current?.focus();
                            }}
                            style={styles.actionBtn}
                        >
                            <Feather name="message-square" size={14} color={colors.subtle} />
                            <Text style={[styles.actionText, { color: colors.subtle }]}>Balas</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => handleShareComment(item)} style={styles.actionBtn}>
                        <Feather name="share-2" size={14} color={colors.subtle} />
                        <Text style={[styles.actionText, { color: colors.subtle }]}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Detail Diskusi</Text>
                <View style={{ width: 44 }} />
            </View>

            <FlatList
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderComment}
                ListHeaderComponent={
                    <View style={[styles.postDetail, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.postAuthorRow}>
                            <View style={[styles.avatar, { backgroundColor: `${colors.primary}10` }]}>
                                <Feather name="user" size={22} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.postAuthorName, { color: colors.text }]}>{post.author_name}</Text>
                                <Text style={{ fontSize: 13, color: colors.subtle }}>
                                    {new Date(post.created_at).toLocaleDateString()}
                                </Text>
                            </View>
                            <View style={[styles.tag, { backgroundColor: `${colors.primary}10` }]}>
                                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>{post.category || 'UMUM'}</Text>
                            </View>
                        </View>

                        <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
                        <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

                        <View style={styles.interactionBar}>
                            <TouchableOpacity onPress={handleLikePost} style={styles.interactionBtn}>
                                <Feather name="heart" size={20} color={post.is_liked ? '#EF4444' : colors.subtle} style={post.is_liked && { fill: '#EF4444' } as any} />
                                <Text style={[styles.interactionText, { color: post.is_liked ? '#EF4444' : colors.subtle }]}>{post.likes || 0}</Text>
                            </TouchableOpacity>
                            <View style={styles.interactionBtn}>
                                <Feather name="message-circle" size={20} color={colors.subtle} />
                                <Text style={[styles.interactionText, { color: colors.subtle }]}>{comments.length}</Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity onPress={handleSharePost} style={styles.shareBtn}>
                                <Feather name="share-2" size={18} color={colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.commentsSectionTitle, { color: colors.text }]}>Komentar ({comments.length})</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
            >
                {replyTo && (
                    <View style={[styles.replyInfo, { backgroundColor: `${colors.primary}05` }]}>
                        <Text style={{ fontSize: 12, color: colors.subtle, flex: 1 }}>
                            Membalas <Text style={{ fontWeight: '700' }}>{replyTo.author_name}</Text>
                        </Text>
                        <TouchableOpacity onPress={() => setReplyTo(null)}>
                            <Feather name="x" size={16} color={colors.subtle} />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.inputWrapper}>
                    <TextInput
                        ref={inputRef}
                        placeholder="Tulis komentar..."
                        placeholderTextColor={colors.subtle}
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                        style={[styles.input, { color: colors.text, backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }]}
                    />
                    <TouchableOpacity
                        onPress={handleSubmitComment}
                        disabled={submitting || !commentText.trim()}
                        style={[styles.sendBtn, { backgroundColor: commentText.trim() ? colors.primary : `${colors.primary}40` }]}
                    >
                        {submitting ? <ActivityIndicator size="small" color="#FFF" /> : <Feather name="send" size={18} color="#FFF" />}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    postDetail: {
        padding: 20,
        borderBottomWidth: 1,
        marginBottom: 12,
    },
    postAuthorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postAuthorName: { fontSize: 16, fontWeight: '700' },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    postTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12, lineHeight: 28 },
    postContent: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
    interactionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 20,
    },
    interactionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    interactionText: { fontSize: 14, fontWeight: '600' },
    shareBtn: {
        padding: 10,
        backgroundColor: 'rgba(27, 92, 196, 0.08)',
        borderRadius: 12,
    },
    divider: { height: 1, marginBottom: 20 },
    commentsSectionTitle: { fontSize: 17, fontWeight: '700' },
    commentCard: {
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    avatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorName: { fontSize: 14, fontWeight: '700' },
    dateText: { fontSize: 11 },
    commentContent: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    actionText: { fontSize: 12, fontWeight: '600' },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        borderTopWidth: 1,
    },
    replyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginBottom: 8,
        borderRadius: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 15,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
