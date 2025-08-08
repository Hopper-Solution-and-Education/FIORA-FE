import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import HopperLogo from '@public/images/logo.jpg';
import Image from 'next/image';

const ProfilePage = () => {
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-orange-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="bg-yellow-100 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 8a3 3 0 110-6 3 3 0 010 6z" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <Tabs defaultValue="profile">
          <TabsList className="bg-transparent border-b-2 border-gray-200 h-auto p-0">
            <TabsTrigger
              value="profile"
              className="text-base font-semibold text-gray-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-2"
            >
              My Profile
            </TabsTrigger>
            <TabsTrigger
              value="setting"
              className="text-base font-semibold text-gray-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-2"
            >
              Setting
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <main>
        <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div>
              {/* Personal Information */}
              <div className="mb-8">
                <SectionHeader title="Personal Information" />
                <p className="text-sm text-gray-500 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input defaultValue="Võ Doãn Anh Phi" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Birthday</label>
                    <Input defaultValue="12/07/2005" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="voanhtphi@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input defaultValue="0866463002" />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-medium">Contact address</label>
                    <Textarea
                      defaultValue="The Varosa Park, 39 Đường số 10, Khu phố 2, Phường Phú Hữu, TP Thủ Đức, HCM, Việt Nam"
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Referral code */}
              <div className="mb-8">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <h2 className="text-lg font-semibold">Referral code</h2>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
              </div>

              {/* Identification Document */}
              <div className="mb-8">
                <SectionHeader title="Identification Document" />
                <p className="text-sm text-gray-500 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
              </div>

              {/* Tax Information */}
              <div className="mb-8">
                <SectionHeader title="Tax Information" />
                <p className="text-sm text-gray-500 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
              </div>

              {/* Bank Accounts */}
              <div className="mb-8">
                <SectionHeader title="Bank Accounts" />
                <p className="text-sm text-gray-500 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end mt-8">
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Quay lại
                  </Button>
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <Image
                      src={HopperLogo}
                      alt="Profile"
                      width={128}
                      height={128}
                      objectFit="cover"
                    />
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Brand Logo */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Brand Logo</h3>
                <div className="flex flex-col items-center">
                  <div className="w-40 h-auto mb-4">
                    <Image
                      src={HopperLogo}
                      alt="Brand Logo"
                      width={160}
                      height={100}
                      objectFit="contain"
                    />
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
