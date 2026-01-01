"use client"

import {
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton, useClerk } from "@clerk/nextjs"
import { UserAvatar } from "@clerk/nextjs"
import { ModeToggle } from "./ModeToggle"

export function NavUser({
  user,
}: {
  user: {
    fullName: string
    emailAddresses: { emailAddress: string }[]
    avatar: string
  }
}) {
  const { signOut, openUserProfile } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer gap-2 p-2  rounded-md">
          <UserAvatar />
          <div className="flex flex-col text-sm">
            <span className="truncate font-medium">{user.fullName}</span>
            <span className="text-xs text-muted-foreground truncate">
              {user.emailAddresses[0]?.emailAddress}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          onSelect={() => openUserProfile()}
          className="cursor-pointer"
        >
          <IconUserCircle className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          asChild
        >
         <SignOutButton>
            <div>
              <IconLogout className="mr-2 h-4 w-4" />
              Sign Out
            </div>
          </SignOutButton>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1"><ModeToggle /></div>          
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
