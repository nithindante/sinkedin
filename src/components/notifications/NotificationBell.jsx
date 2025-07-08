'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import NotificationPanel from './NotificationPanel'
import { createClient } from '@/lib/supabase/client'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef(null)

  const supabase = createClient()

  // Setup notifications and realtime subscription
  useEffect(() => {
    let channel = null
    let isMounted = true

    const setupNotifications = async () => {
      try {
        // 1. Get the user first
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error getting user:', userError)
          return
        }

        // If no user, we don't need to do anything
        if (!user) return

        // Check if component is still mounted
        if (!isMounted) return

        // 2. Fetch the initial count of unread notifications
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_user_id', user.id)
          .eq('is_read', false)

        if (error) {
          console.error('Error fetching unread notifications:', error)
        } else if (isMounted) {
          setUnreadCount(count ?? 0)
        }

        // 3. Set up the real-time listener
        if (isMounted) {
          const channelName = `realtime:notifications:${user.id}`

          channel = supabase
            .channel(channelName)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_user_id=eq.${user.id}`,
              },
              (payload) => {
                console.log('New notification received:', payload)
                // Only update if component is still mounted
                if (isMounted) {
                  setUnreadCount((currentCount) => currentCount + 1)
                }
              },
            )
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_user_id=eq.${user.id}`,
              },
              (payload) => {
                console.log('Notification updated:', payload)
                // If a notification was marked as read, update the count
                if (payload.new.is_read && !payload.old.is_read && isMounted) {
                  setUnreadCount((currentCount) =>
                    Math.max(0, currentCount - 1),
                  )
                }
              },
            )
            .subscribe()
        }
      } catch (error) {
        console.error('Error setting up notifications:', error)
      }
    }

    setupNotifications()

    return () => {
      isMounted = false
      if (channel) {
        // console.log('Cleaning up notification channel...')
        channel.unsubscribe()
        supabase.removeChannel(channel)
      }
    }
  }, []) // Remove isSubscribed from dependencies

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleBellClick = async () => {
    setIsOpen((prev) => !prev)

    // Mark notifications as read when opening the panel
    if (!isOpen && unreadCount > 0) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('recipient_user_id', user.id)
            .eq('is_read', false)

          if (error) {
            console.error('Error marking notifications as read:', error)
          } else {
            setUnreadCount(0)
          }
        }
      } catch (error) {
        console.error('Error in handleBellClick:', error)
      }
    }
  }

  const hasUnread = unreadCount > 0

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleBellClick}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <Bell className="text-light h-6 w-6" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-accent border-2 border-dark-secondary rounded-full"></span>
        )}
      </button>

      {isOpen && <NotificationPanel setUnreadCount={setUnreadCount} />}
    </div>
  )
}
