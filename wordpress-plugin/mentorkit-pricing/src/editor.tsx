/**
 * Gutenberg Block Editor Script
 * Registers the MentorKit Pricing block in the WordPress block editor
 */

import React from 'react';

// WordPress dependencies (provided by WordPress)
declare const wp: {
  blocks: {
    registerBlockType: (name: string, settings: object) => void;
  };
  element: {
    createElement: typeof React.createElement;
  };
  blockEditor: {
    useBlockProps: () => object;
    InspectorControls: React.ComponentType<{ children: React.ReactNode }>;
  };
  components: {
    PanelBody: React.ComponentType<{ title: string; children: React.ReactNode }>;
    SelectControl: React.ComponentType<{
      label: string;
      value: string;
      options: { label: string; value: string }[];
      onChange: (value: string) => void;
    }>;
    Placeholder: React.ComponentType<{
      icon: string;
      label: string;
      instructions: string;
    }>;
  };
};

const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, SelectControl, Placeholder } = wp.components;

interface BlockAttributes {
  theme: string;
}

interface EditProps {
  attributes: BlockAttributes;
  setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

// Block edit component
function Edit({ attributes, setAttributes }: EditProps) {
  const blockProps = useBlockProps();
  const { theme } = attributes;

  return createElement(
    'div',
    blockProps,
    createElement(
      InspectorControls,
      null,
      createElement(
        PanelBody,
        { title: 'Pricing Settings' },
        createElement(SelectControl, {
          label: 'Theme',
          value: theme,
          options: [
            { label: 'Auto (follows site theme)', value: 'auto' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
          onChange: (value: string) => setAttributes({ theme: value }),
        })
      )
    ),
    createElement(Placeholder, {
      icon: 'money-alt',
      label: 'MentorKit Pricing Calculator',
      instructions: 'The interactive pricing calculator will be displayed here on the frontend.',
    })
  );
}

// Register the block
registerBlockType('mentorkit/pricing-calculator', {
  title: 'MentorKit Pricing',
  description: 'Display an interactive pricing calculator for MentorKit products.',
  category: 'widgets',
  icon: 'money-alt',
  keywords: ['pricing', 'calculator', 'mentorkit', 'plans'],
  supports: {
    html: false,
    align: ['wide', 'full'],
  },
  attributes: {
    theme: {
      type: 'string',
      default: 'auto',
    },
  },
  edit: Edit,
  save: () => null, // Dynamic block - rendered by PHP
});
