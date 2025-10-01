"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function TestFeedbackPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const sampleFeedbacks = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechStart Inc",
      feedback: "Exceptional work! The portfolio website exceeded all our expectations. The attention to detail and user experience is outstanding.",
      type: "general",
      rating: 5,
      email: "sarah.johnson@techstart.com",
      isVisible: true,
      isApproved: true
    },
    {
      name: "Michael Chen",
      role: "Frontend Developer", 
      company: "DigitalFlow",
      feedback: "Amazing coding skills and modern design approach. The website is both beautiful and highly functional.",
      type: "general",
      rating: 5,
      email: "michael@digitalflow.com",
      isVisible: true,
      isApproved: true
    },
    {
      name: "Emma Rodriguez",
      role: "UI/UX Designer",
      company: "CreativeHub", 
      feedback: "Perfect blend of creativity and technical expertise. The design implementation was flawless.",
      type: "general",
      rating: 5,
      email: "emma@creativehub.com",
      isVisible: true,
      isApproved: true
    },
    {
      name: "James Wilson",
      role: "Startup Founder",
      company: "InnovateCorp",
      feedback: "Professional, reliable, and incredibly talented. Our project was delivered on time and beyond expectations.",
      type: "project",
      projectName: "E-commerce Platform",
      rating: 5,
      email: "james@innovatecorp.com",
      isVisible: true,
      isApproved: true
    }
  ]

  const addSampleFeedback = async () => {
    setIsLoading(true)
    try {
      const results = []
      
      for (const feedback of sampleFeedbacks) {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedback),
        })
        
        const result = await response.json()
        results.push(result)
      }
      
      setResult(results)
      toast({
        title: "Success",
        description: `Added ${results.length} sample feedback entries`,
      })
      
    } catch (error) {
      console.error('Error adding feedback:', error)
      toast({
        title: "Error",
        description: "Failed to add sample feedback",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testFeedbackAPI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/feedback?visible=true&approved=true')
      const data = await response.json()
      setResult(data)
      
      toast({
        title: "API Test Complete",
        description: `Found ${data.data?.length || 0} approved feedback entries`,
      })
    } catch (error) {
      console.error('Error testing API:', error)
      toast({
        title: "API Error",
        description: "Failed to fetch feedback from API",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Testing Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={addSampleFeedback} 
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Sample Feedback"}
            </Button>
            
            <Button 
              onClick={testFeedbackAPI} 
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? "Testing..." : "Test API"}
            </Button>
          </div>
          
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Add Sample Feedback" to populate the database with test data</li>
              <li>Click "Test API" to verify the feedback API is working</li>
              <li>Visit the main page to see dynamic testimonials</li>
              <li>Check the browser console for debug information</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}