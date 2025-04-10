"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image, MessageSquare, UserPlus } from "lucide-react"

export default function UserProfileCard() {
  // Sample user data - replace with your actual data
  const user = {
    name: "Alex Morgan",
    age: 28,
    utr: 9.5,
    compatibility: 78,
    bio: "Tennis enthusiast with 10+ years of experience. Looking for competitive doubles partners and weekend matches. Available most evenings and weekends.",
    preferences: [
      { title: "Play Style", value: "Aggressive Baseliner" },
      { title: "Availability", value: "Weekends & Evenings" },
      { title: "Location", value: "Downtown Tennis Club" },
      { title: "Skill Focus", value: "Doubles Strategy" },
    ],
    media: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <span className="text-muted-foreground">{user.age}</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-600 hover:bg-green-700">UTR {user.utr}</Badge>
                <div className="text-sm text-muted-foreground">Tennis Rating</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Connect
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Compatibility */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Compatibility</h3>
            <span className="text-sm font-medium">{user.compatibility}%</span>
          </div>
          <Progress value={user.compatibility} className="h-2" />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Bio</h3>
          <p className="text-sm text-muted-foreground">{user.bio}</p>
        </div>

        {/* Preferences */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Preferences</h3>
          <div className="grid grid-cols-2 gap-3">
            {user.preferences.map((pref, index) => (
              <div key={index} className="border rounded-lg p-3 bg-muted/50">
                <h4 className="text-xs text-muted-foreground">{pref.title}</h4>
                <p className="text-sm font-medium">{pref.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Media</h3>
            <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1">
              <Image className="h-4 w-4" />
              View All
            </Button>
          </div>

          <Tabs defaultValue="photos">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="photos" className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                {user.media.map((src, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`${user.name}'s media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="videos" className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                {user.media.slice(0, 2).map((src, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center"
                  >
                    <div className="text-sm text-muted-foreground">Video {index + 1}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

