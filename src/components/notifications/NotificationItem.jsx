import Image from 'next/image'
import Link from 'next/link'
import { MessageSquare, UserPlus, Smile } from 'lucide-react'

// Helper to get the right icon for the notification type
const getIconForType = (type) => {
  switch (type) {
    case 'new_comment':
      return <MessageSquare className="w-5 h-5 text-light-secondary" />
    case 'new_reaction':
      return <Smile className="w-5 h-5 text-light-secondary" />
    case 'new_follower':
      return <UserPlus className="w-5 h-5 text-light-secondary" />
    default:
      return null
  }
}

export default function NotificationItem({ notification }) {
  console.log(notification)
  const { type, triggerUser, postLink, time, isRead } = notification

  let message
  switch (type) {
    case 'new_comment':
      message = (
        <>
          <span className="font-semibold text-light">{triggerUser.name}</span>{' '}
          commented on your post.
        </>
      )
      break
    case 'new_reaction':
      message = (
        <>
          <span className="font-semibold text-light">{triggerUser.name}</span>{' '}
          reacted to your post.
        </>
      )
      break
    case 'new_follower':
      message = (
        <>
          <span className="font-semibold text-light">{triggerUser.name}</span>{' '}
          started following you.
        </>
      )
      break
    default:
      message = 'New notification'
  }

  return (
    <Link
      href={postLink || `/profile/${triggerUser.id}`}
      className="flex items-start gap-4 p-3 hover:bg-dark transition-colors rounded-lg"
    >
      {/* Read/Unread Dot */}
      <div className="flex-shrink-0 pt-1.5">
        {!isRead && <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0 relative">
        <Image
          src={triggerUser.avatar}
          alt={triggerUser.name}
          width={40}
          height={40}
          className="rounded-full object-cover w-10 h-10"
        />
      </div>

      {/* Message Content */}
      <div className="flex-1 text-sm">
        <p className="text-light-secondary">{message}</p>
        <p className="text-xs text-light-secondary/70 mt-1">{time}</p>
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 pt-1">{getIconForType(type)}</div>
    </Link>
  )
}
