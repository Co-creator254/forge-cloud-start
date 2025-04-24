import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Eye, Clock, PenSquare } from "lucide-react";
import { QualityControlDiscussion } from "@/types";
import { fetchQualityDiscussions } from "@/services/serviceProvidersAPI";
import { useToast } from "@/hooks/use-toast";

const QualityControlDiscussions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<QualityControlDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");
  
  const allTags = ["counterfeit", "verification", "export", "regulations", "avocados", "EU", "pesticides"];

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchQualityDiscussions();
        setDiscussions(data);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        toast({
          title: "Error",
          description: "Failed to load discussions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscussions();
  }, [toast]);

  const filteredDiscussions = discussions.filter(discussion => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tag
    const matchesTag = filterTag === "all" || discussion.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quality Control Discussions</h1>
            <p className="text-muted-foreground mt-2">
              Join the conversation on agricultural quality standards and challenges
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <PenSquare className="mr-2 h-4 w-4" /> Start New Discussion
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No discussions found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Be the first to start a discussion on this topic!
            </p>
            <Button>Start New Discussion</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card key={discussion.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{discussion.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    Started by {discussion.authorName}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {discussion.authorType}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{discussion.content}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {discussion.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant={filterTag === tag ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setFilterTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {discussion.commentCount} comments
                    </span>
                    <span className="flex items-center">
                      <Eye className="mr-1 h-4 w-4" />
                      {discussion.viewCount} views
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Discussion
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QualityControlDiscussions;
