import { useState } from "react";
import { Loader, Pencil, Save, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { EmailMatchChart } from "@/components/PieChart";

const emailTypes = ["1", "2", "3"];

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEmailGenerating, setIsEmailGenerating] = useState(false);
  const [isEmailComparing, setIsEmailComparing] = useState(false);
  const [emailType, setEmailType] = useState("1");
  const [generatedEmailResponses, setGeneratedEmailResponses] = useState(null);

  const [meaningMatchScore, setMeaningMatchScore] = useState(null);
  const [bestOne, setBestOne] = useState("");
  const [whyItsBest, setWhyItsBest] = useState("");

  const handleGenerate = async () => {
    setIsEditing(false);
    setIsEmailGenerating(true);
    try {
      const formData = new FormData();
      formData.append("customerEmail", inputText);

      const res = await axios.post(
        "http://localhost:3000/generate-email-response",
        formData
      );

      setGeneratedEmailResponses(res?.data?.data);
      const responseData = res?.data?.data?.find(
        (r) => r.emailType == emailType
      );

      setOutputText(responseData?.responseEmail);
      toast("Response Emails Generated");
    } catch (error) {
      console.error(error);
    } finally {
      setIsEmailGenerating(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setOutputText(botGeneratedEmail);
    }
    setIsEditing(!isEditing);

    toast(isEditing ? "Editing Disabled" : "Editing Enabled");
  };

  const handleCompare = async () => {
    setIsEditing(false);
    setIsEmailComparing(true);

    try {
      const emailData = generatedEmailResponses.find(
        (r) => r.emailType == emailType
      );
      console.log("comapare:", emailData);
      const formData = new FormData();
      formData.append("botGeneratedEmail", emailData?.responseEmail);
      formData.append("editedEmail", outputText);
      formData.append("category", emailData?.category);
      formData.append("subcategory", emailData?.subcategory);
      formData.append("scenario", emailData?.scenario);

      const res = await axios.post(
        "http://localhost:3000/compare-emails",
        formData
      );
      setMeaningMatchScore(res?.data?.data?.meaningMatchScore);
      setBestOne(res?.data?.data?.bestOne);
      setWhyItsBest(res?.data?.data?.whyItsBest);
      toast("Emails Compared");
    } catch (error) {
      console.error(error);
    } finally {
      setIsEmailComparing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast("Copied to clipboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTypeChange = (t) => {
    setEmailType(t);
    const emailData = generatedEmailResponses.find((r) => r.emailType == t);
    setOutputText(emailData?.responseEmail);
  };

  return (
    <>
      <main className="flex flex-col md:flex-row min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Section */}
        <Card className="w-full md:w-1/2 flex flex-col shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-semibold">
              Paste Email
            </CardTitle>
            <CardDescription>
              Paste or type your customer email below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-4 sm:p-6">
            <Textarea
              placeholder="Paste or type your customer email here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow resize-none text-sm leading-relaxed p-3 sm:p-4 rounded-md border-input min-h-[250px] sm:min-h-[300px] md:min-h-[400px] focus-visible:ring-ring"
              aria-label="Input text area"
            />
            <Button
              onClick={handleGenerate}
              className="mt-4 sm:mt-6 w-full sm:w-auto self-start py-2.5 px-5 sm:py-3 sm:px-6 text-sm sm:text-base"
              disabled={!inputText.trim() || isEmailGenerating}
            >
              {!isEmailGenerating ? (
                <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Loader className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              )}{" "}
              Generate
            </Button>
          </CardContent>
        </Card>

        {/* Right Section */}
        <Card className="w-full md:w-1/2 flex flex-col shadow-xl rounded-lg">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-semibold">
                Edit And Compare
              </CardTitle>
              <CardDescription>
                Edit bot generated email response and compare.
              </CardDescription>
              <div className="flex gap-4">
                {emailTypes.map((t, index) => {
                  return (
                    <Button
                      key={index}
                      className={`mt-4 sm:mt-6 w-full sm:w-auto self-start py-2.5 px-5 sm:py-3 sm:px-6 text-sm sm:text-base ${
                        t !== emailType ? "bg-gray-400" : ""
                      }`}
                      onClick={() => handleTypeChange(t)}
                    >
                      Email: {t}
                    </Button>
                  );
                })}
              </div>
              {generatedEmailResponses && generatedEmailResponses.length > 0 ? (
                <h2 className="mt-2 text-sm ">
                  Tagged Category as{" "}
                  {
                    generatedEmailResponses.find(
                      (t) => t.emailType == emailType
                    )?.category
                  }{" "}
                  and Subcategory as{" "}
                  {
                    generatedEmailResponses.find(
                      (t) => t.emailType == emailType
                    )?.subcategory
                  }
                </h2>
              ) : null}
            </div>
            <Button onClick={handleCopy}>Copy</Button>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-4 sm:p-6">
            <Textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              disabled={!isEditing}
              className="flex-grow resize-none text-sm leading-relaxed p-3 sm:p-4 rounded-md border-input min-h-[250px] sm:min-h-[300px] md:min-h-[400px] focus-visible:ring-ring disabled:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-80"
              aria-label="Output text area"
            />
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start">
              <Button
                onClick={handleEditToggle}
                variant={isEditing ? "outline" : "default"}
                className="py-2.5 px-5 sm:py-3 sm:px-6 text-sm sm:text-base w-full sm:w-auto"
              >
                <Pencil className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{" "}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button
                onClick={handleCompare}
                disabled={!isEditing || isEmailComparing}
                className="py-2.5 px-5 sm:py-3 sm:px-6 text-sm sm:text-base w-full sm:w-auto"
              >
                {!isEmailComparing ? (
                  <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Loader className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                )}{" "}
                Compare
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      {meaningMatchScore !== null && (
        <EmailMatchChart
          meaningMatchScore={meaningMatchScore}
          bestOne={bestOne}
          whyItsBest={whyItsBest}
        />
      )}
      <ToastContainer />
    </>
  );
}
