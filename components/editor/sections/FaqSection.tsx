 "use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Icons } from "@/app/components/dashboard/icons";
import { SectionProps } from "../types";

export function FaqSection({ data, updateData }: SectionProps) {
  const handleAddFaq = () => {
    const items = [...data.faq.items];
    items.push({ question: "New Question", answer: "Answer this question" });
    updateData("faq.items", items);
  };

  const handleRemoveFaq = (index: number) => {
    const items = [...data.faq.items];
    items.splice(index, 1);
    updateData("faq.items", items);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">FAQ Section</h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.faq.title}
          onChange={e => updateData("faq.title", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={data.faq.subtitle}
          onChange={e => updateData("faq.subtitle", e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <Label>FAQ Items</Label>
        <Button onClick={handleAddFaq} variant="outline" size="sm">
          Add FAQ
        </Button>
      </div>
      {data.faq.items.map((item, index) => (
        <Card key={index} className="p-4 space-y-2">
          <div className="flex justify-between">
            <Label>FAQ {index + 1}</Label>
            <Button
              onClick={() => handleRemoveFaq(index)}
              variant="ghost"
              size="sm"
              className="text-destructive"
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Question</Label>
            <Input
              value={item.question}
              onChange={e => {
                const items = [...data.faq.items];
                items[index] = { ...item, question: e.target.value };
                updateData("faq.items", items);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Answer</Label>
            <Textarea
              value={item.answer}
              onChange={e => {
                const items = [...data.faq.items];
                items[index] = { ...item, answer: e.target.value };
                updateData("faq.items", items);
              }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}