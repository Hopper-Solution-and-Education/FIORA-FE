'use client';

import { Bell, Mail, Search } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CategoryPage = () => {
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-5xl mx-auto">
          {/* Header */}
          <div className="p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium text-[#3e435d]">Welcome, Amanda</h1>
              <p className="text-[#86909c] text-sm">Tue, 07 June 2022</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86909c]"
                  size={18}
                />
                <Input
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 rounded-full border-[#f9f9f9] bg-[#f9f9f9] w-64"
                />
              </div>
              <Bell size={20} className="text-[#86909c]" />
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Banner */}
          <div className="h-16 bg-gradient-to-r from-[#c5dbff] to-[#fff5d9]"></div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Alexa Rawles" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-medium text-[#3e435d]">Alexa Rawles</h2>
                  <p className="text-[#86909c]">alexarawles@gmail.com</p>
                </div>
              </div>
              <Button className="bg-[#4182f9] hover:bg-[#3a75e0] text-white rounded-lg px-6">
                Edit
              </Button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block mb-2 text-[#3e435d] font-medium">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your First Name"
                  className="border-[#f9f9f9] bg-[#f9f9f9] rounded-lg"
                />
              </div>

              {/* Nick Name */}
              <div>
                <label htmlFor="nickName" className="block mb-2 text-[#3e435d] font-medium">
                  Nick Name
                </label>
                <Input
                  id="nickName"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  placeholder="Your First Name"
                  className="border-[#f9f9f9] bg-[#f9f9f9] rounded-lg"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block mb-2 text-[#3e435d] font-medium">
                  Gender
                </label>
                <Select>
                  <SelectTrigger className="border-[#f9f9f9] bg-[#f9f9f9] rounded-lg">
                    <SelectValue placeholder="Your First Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block mb-2 text-[#3e435d] font-medium">
                  Country
                </label>
                <Select>
                  <SelectTrigger className="border-[#f9f9f9] bg-[#f9f9f9] rounded-lg">
                    <SelectValue placeholder="Your First Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div>
                <label htmlFor="language" className="block mb-2 text-[#3e435d] font-medium">
                  Language
                </label>
                <Select>
                  <SelectTrigger className="border-[#f9f9f9] bg-[#f9f9f9] rounded-lg">
                    <SelectValue placeholder="Your First Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Zone */}
              <div>
                <label htmlFor="timezone" className="block mb-2 text-[#3e435d] font-medium">
                  Time Zone
                </label>
                <Select>
                  <SelectTrigger className="border-[#f9f9f9] bg-[#f9f9f9] rounded-lg">
                    <SelectValue placeholder="Your First Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">UTC-08:00 Pacific Time</SelectItem>
                    <SelectItem value="utc-5">UTC-05:00 Eastern Time</SelectItem>
                    <SelectItem value="utc+0">UTC+00:00 GMT</SelectItem>
                    <SelectItem value="utc+1">UTC+01:00 Central European Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Email Section */}
            <div className="mt-8">
              <h3 className="text-[#3e435d] font-medium mb-4">My email Address</h3>
              <div className="bg-[#f9f9f9] p-4 rounded-lg flex items-center gap-3 mb-4 max-w-md">
                <div className="bg-white p-2 rounded-lg">
                  <Mail size={18} className="text-[#4182f9]" />
                </div>
                <div>
                  <p className="text-[#3e435d]">alexarawles@gmail.com</p>
                  <p className="text-[#86909c] text-sm">1 month ago</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="text-[#4182f9] border-[#4182f9] hover:bg-[#f0f7ff]"
              >
                + Add Email Address
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
