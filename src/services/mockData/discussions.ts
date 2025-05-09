
import { QualityControlDiscussion } from '@/types';

export const mockDiscussions: QualityControlDiscussion[] = [
  {
    id: "1",
    title: "Detecting counterfeit pesticides in Nakuru region",
    content: "I've encountered what I believe are counterfeit pesticides being sold in local agrovets. They have similar packaging to known brands but the prices are suspiciously low. After application, they seem to have little effect on pests. Has anyone else experienced this? How can we verify authentic products?",
    authorId: "user1",
    authorName: "John Kamau",
    authorType: "farmer",
    createdAt: "2023-05-15T08:30:00Z",
    commentCount: 15,
    viewCount: 324,
    tags: ["counterfeit", "pesticides", "verification", "nakuru"]
  },
  {
    id: "2",
    title: "EU export requirements for avocados",
    content: "Our cooperative is looking to export avocados to the European Union. Could someone explain the current quality certification requirements and how to ensure our produce meets them? What documentation do we need and which laboratories are authorized to provide certification?",
    authorId: "user2",
    authorName: "Sarah Ochieng",
    authorType: "farmer",
    createdAt: "2023-06-02T14:20:00Z",
    commentCount: 8,
    viewCount: 189,
    tags: ["export", "EU", "avocados", "certification"]
  },
  {
    id: "3",
    title: "Interpreting pesticide residue test results",
    content: "I received lab results for pesticide residue tests on my tomatoes, but I'm not sure how to interpret them. The report shows levels of certain compounds, but I don't know if these are within acceptable limits for local markets versus export. Can someone help me understand these figures?",
    authorId: "user3",
    authorName: "Dr. Peter Njoroge",
    authorType: "expert",
    createdAt: "2023-06-10T10:15:00Z",
    commentCount: 12,
    viewCount: 207,
    tags: ["pesticides", "residue", "testing", "tomatoes"]
  },
  {
    id: "4",
    title: "New regulations on maize moisture content",
    content: "I heard there are new regulations about the acceptable moisture content for maize storage and sale. Can anyone clarify what these new standards are and how they're being enforced? What equipment should we use to measure moisture content accurately?",
    authorId: "user4",
    authorName: "Grace Mutua",
    authorType: "farmer",
    createdAt: "2023-06-18T16:45:00Z",
    commentCount: 5,
    viewCount: 143,
    tags: ["regulations", "maize", "moisture", "storage"]
  },
  {
    id: "5",
    title: "Organic certification process for small-scale farmers",
    content: "As a small-scale farmer (2 acres), I'm interested in getting organic certification for my vegetables. Is it worth the cost and effort? Has anyone gone through this process recently who could share their experience? Are there any group certification options for small farmers?",
    authorId: "user5",
    authorName: "David Kimani",
    authorType: "farmer",
    createdAt: "2023-07-05T09:30:00Z",
    commentCount: 23,
    viewCount: 286,
    tags: ["organic", "certification", "small-scale", "vegetables"]
  },
  {
    id: "6",
    title: "Quality standards for local vs. export markets",
    content: "I'm noticing a big difference between what's accepted in local markets versus what exporters will take. How do others manage quality sorting efficiently to serve both markets? Are there affordable technologies or methods that can help small farmers grade produce more effectively?",
    authorId: "user6",
    authorName: "Janet Wambui",
    authorType: "farmer",
    createdAt: "2023-07-15T11:20:00Z",
    commentCount: 7,
    viewCount: 168,
    tags: ["quality", "grading", "export", "local"]
  },
  {
    id: "7",
    title: "Aflatoxin testing for maize and groundnuts",
    content: "After recent reports of aflatoxin contamination, I want to ensure my maize and groundnut harvests are safe. Where can farmers access affordable testing services? Are there any visual indicators we can use for initial screening before lab testing?",
    authorId: "user7",
    authorName: "Michael Otieno",
    authorType: "farmer",
    createdAt: "2023-07-28T13:10:00Z",
    commentCount: 19,
    viewCount: 412,
    tags: ["aflatoxin", "testing", "maize", "groundnuts", "safety"]
  },
  {
    id: "8",
    title: "Implementation of Kenya GAP standards",
    content: "I've been hearing about Kenya GAP (Good Agricultural Practices) standards but haven't seen clear guidance on implementation. Has anyone received certification under this program? What are the key requirements and how different are they from GlobalGAP?",
    authorId: "user8",
    authorName: "Elizabeth Njeri",
    authorType: "expert",
    createdAt: "2023-08-05T15:40:00Z",
    commentCount: 11,
    viewCount: 231,
    tags: ["KenyaGAP", "standards", "certification", "implementation"]
  }
];
