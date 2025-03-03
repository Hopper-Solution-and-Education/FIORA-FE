import type { Page } from './types';

export const initialPages: Page[] = [
  // Page 1: Personal Information
  {
    data: {
      heading: 'Contact Havelock Wool',
      subheading: 'Tell us about yourself.',
      button: 'Next',
    },
    questions: [
      {
        id: 'firstname-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'First Name',
        type: 'text',
        required: true,
      },
      {
        id: 'lastname-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Last Name',
        type: 'text',
        required: true,
      },
      {
        id: 'email-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Email',
        type: 'email',
        required: true,
      },
      {
        id: 'phone-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Phone Number',
        type: 'tel',
        required: true,
      },
    ],
  },
  // Page 2: Project Details
  {
    data: {
      heading: 'Project Details',
      subheading: 'Tell us about your project.',
      button: 'Next',
    },
    questions: [
      {
        id: 'type_of_project-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'I am a...',
        type: 'select',
        required: true,
        options: [
          { label: 'Homeowner', value: 'Residential' },
          { label: 'Builder', value: 'Builder' },
          { label: 'Installer', value: 'Installer' },
          { label: 'Sound panel', value: 'sound panel distributor' },
          { label: 'Duct Wrap', value: 'duct distributor' },
          { label: '#vanlifer', value: '#vanlife' },
        ],
      },
      {
        id: 'i_am_building_a___-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'I am building a...',
        type: 'select',
        required: true,
        options: [
          { label: 'New house', value: 'New house' },
          { label: 'Renovation project', value: 'Renovation project' },
          { label: 'ADU', value: 'ADU' },
          { label: 'Tinyhouse', value: 'Tinyhouse' },
          { label: 'Shed / Hut', value: 'Shed / Hut' },
          { label: 'Barn', value: 'Barn' },
          { label: 'Attic/Crawl House', value: 'Attic/Crawl House' },
          { label: 'Others (Please explain in the message section)', value: 'Others' },
        ],
      },
      {
        id: 'what_is_your_budget_-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'What are your expected insulation costs?',
        type: 'select',
        required: true,
        options: [
          { label: 'Under $1,000', value: 'Under $1,000' },
          { label: '$1,000-$5,000', value: '$1,000-$5,000' },
          { label: '$5,000-$10,000', value: '$5,000-$10,000' },
          { label: '$10,000+', value: '$10,000+' },
        ],
      },
      {
        id: 'expected_project_date_-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Expected Project Date:',
        type: 'select',
        required: true,
        options: [
          {
            label: 'I am desperate for sustainable, high-performance insulation now',
            value: 'I am desperate for sustainable, high-performance insulation now',
          },
          { label: 'New construction in progress', value: 'New construction in progress' },
          { label: 'Renovation in progress', value: 'Renovation in progress' },
          {
            label: 'Project planning work to begin in the next 3 months',
            value: 'Project planning work to begin in the next 3 months',
          },
          {
            label: 'Unsure when construction will start',
            value: 'Unsure when construction will start',
          },
        ],
      },
    ],
  },
  // Page 3: Installation Details
  {
    data: {
      heading: 'Installation Details',
      subheading: 'Tell us about your installation plans.',
      button: 'Next',
    },
    questions: [
      {
        id: 'who_will_be_installing_-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Who will be installing? (if a residential project)',
        type: 'select',
        required: true,
        options: [
          { label: 'I will!', value: 'I will!' },
          { label: 'Professional', value: 'Professional' },
          { label: 'Handywoman / Handyman', value: 'Handywoman / Handyman' },
          { label: "I don't know", value: "I don't know" },
        ],
      },
      {
        id: 'zip-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Project Postal Code',
        type: 'text',
        required: true,
      },
      {
        id: 'country-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Country/Region',
        type: 'text',
        required: true,
      },
    ],
  },
  // Page 4: Additional Information
  {
    data: {
      heading: 'Additional Information',
      subheading: 'Any extra details?',
      button: 'Submit',
    },
    questions: [
      {
        id: 'where_did_you_hear_about_us_-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Where did you hear about us?',
        type: 'select',
        required: true,
        options: [
          { label: 'News Article', value: 'PR Article' },
          { label: 'Google', value: 'Google' },
          { label: 'Facebook', value: 'Facebook' },
          { label: 'Instagram', value: 'Instagram' },
          { label: 'YouTube', value: 'YouTube' },
          { label: 'Word of Mouth', value: 'Word of Mouth' },
          { label: 'Other', value: 'Other' },
        ],
      },
      {
        id: 'have_you_already_purchased_from_us_-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Have you already purchased from us?',
        type: 'select',
        required: true,
        options: [
          { label: 'Yes', value: 'Yes' },
          { label: 'No', value: 'No' },
        ],
      },
      {
        id: 'message_cloned_-409cc67b-ba66-4c70-99ed-206a1668305f',
        question: 'Message',
        type: 'textarea',
        required: false,
      },
    ],
  },
];
