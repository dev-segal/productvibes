import React, { Component, useEffect, useState } from 'react';

import {ProductsMajor,NoteMinor} from '@shopify/polaris-icons';

import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';

import { FileDropper } from './FileDropper.jsx';
import { Stepper, Step } from 'react-form-stepper';

import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';


import { SelectRules } from './SelectRules.jsx';
import {
  Card,
  Icon,
  ResourceItem,
  Layout,
  EmptyState,
  Modal,
  ChoiceList,
  SkeletonBodyText,
  Button,
  TextStyle,
  Select,
  Filters,
  SkeletonPage,  
  ResourceList,
  SkeletonDisplayText, 
  TextContainer,
  TextField,
  DropZone,
  Page,
  Thumbnail,
  Tooltip,
  Heading,
  Stack,
  Caption,
  Collapsible

} from "@shopify/polaris";
import {
  DeleteMajor
} from '@shopify/polaris-icons';


import { useParams } from 'react-router';
// import {  useAppBridge } from "@shopify/app-bridge-react";

import {ResourcePicker} from '@shopify/app-bridge/actions';

import {Toast} from '@shopify/app-bridge/actions';
// import { ChooseResource } from './ChooseResource';

import { ChooseResource } from './ChooseResource';
import { ExistingFileChooser } from './ExistingFileChooser.jsx';


// import React, { useState, useCallback } from "react";

// import {
//   AppProvider,
//   Page,
//   Card,
//   ResourceItem,
//   Icon,
//   Stack,
//   Thumbnail,
//   Heading,
//   Tooltip
// } from "@shopify/polaris";
import { DragHandleMinor } from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useCallback } from 'react';
// import "@shopify/polaris/styles.css";

// get metafield from product 

const ITEMS = [
  {
    id: "1",
    title: "Example list item"
  },
  {
    id: "2",
    title: "Example list item"
  },
  {
    id: "3",
    title: "Example list item"
  },
  {
    id: "4",
    title: "Example list item"
  },
  {
    id: "5",
    title: "Example list item"
  }
];


export function ResourcePage(props) {
    // data? perhaps GID
    let { rid, type } = useParams();

    const GET_PRODUCT = gql`
      {
        product(id: "${rid}") {
          id
          title
          handle


          metafields (namespace: "prodvibes_prod_files", first: 1) {
            nodes {
              value
            } 
          }
        }

      }
`;

const GET_PRODUCT_VARIANT = gql`
      {
        product: productVariant(id: "${rid}") {
          id

          metafields (namespace: "prodvibes_var_files", first: 1) {
            nodes {
              value
            } 
          }

        }

      }
`;

const GET_COLLECTION = gql`
      {
        product: collection(id: "${rid}") {
          id
          title

          metafields (namespace: "prodvibes_coll_files", first: 1) {
            nodes {
              value
            } 
          }

        }

      }
`;

const GET_SHOP = gql`
      {
        shop {
          id
          title
        }

      }
`;

const [connectedFiles, setFiles] = useState([]);

function ListItem(props) {
  const { id, index, title } = props;

  // console.log(provided)
  // console.log(snapshot)

  // var open = false;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        
        window.open = false;

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={
              snapshot.isDragging
                ? { listStyle: "none", background: "white", ...provided.draggableProps.style }
                : {listStyle: "none", ...provided.draggableProps.style}
            }
          >
            <ResourceItem onClick={() => {
              window.open = true;
            }}  id={id}>
              <Stack distribution='leading'>
                
                <div {...provided.dragHandleProps}>
                  <Tooltip content="Drag to reorder list items">
                    <Icon source={DragHandleMinor} color="inkLightest" />
                  </Tooltip>
                </div>
                
                <Heading>{title}</Heading>

              </Stack>

              <Collapsible open={true} expandOnPrint>
                <Stack distribution="trailing">
                 <Button size='slim' destructive><Icon source={DeleteMajor} color="inkLightest" /></Button>       
                </Stack>
              </Collapsible>

            </ResourceItem>
          </div>
        );
      }}
    </Draggable>
  );
}

function List() {
  const [items, setItems] = useState(connectedFiles);

  const handleDragEnd = useCallback(({ source, destination }) => {
    setItems((oldItems) => {
      const newItems = oldItems.slice(); // Duplicate
      const [temp] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, temp);
      return newItems;
    });
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="root">
        {(provided) => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              
              {items.map((item, index) => (
                <ListItem
                  key={item.id}
                  id={item.id}
                  index={index}
                  title={item.title}
                />
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}


    if(type == 'Product') {

      var { loading, error, data }= useQuery(GET_PRODUCT);

    } else if(type == 'Variant') {
      var { loading, error, data }= useQuery(GET_PRODUCT_VARIANT);

    } else if(type == 'Collection') {
      var { loading, error, data }= useQuery(GET_COLLECTION);

    } else if(type == 'Shop') {
      var { loading, error, data }= useQuery(GET_SHOP);

    }

    const [heading, setHeading] = useState("");

    useEffect(() => {

      if(!loading && !error && data) {
        console.log("Received")

        // get the files
        var files = JSON.parse(data.product.metafields.nodes[0].value)

        var parsedFiles = []

        for (var i = 0; i < files.length; i++) {
          
          var url = files[i].split("?")[0]
          var urlSplit = url.split("/")
          var fileName = urlSplit[urlSplit.length-1]
          
          var parsedFile = {
            title: fileName,
            id: `ID-${i}`
          }

          parsedFiles.push(parsedFile)
        }

        setFiles(parsedFiles)

      }

    }, [data]);

    

    return <>
      <Page 
      breadcrumbs={[{content: "Attachments", url: "/files"}]}
      singleColumn title={<>{rid}</>}>
  <Layout>
    <Layout.Section>

      <Card title={"Files"}>

        <Card.Section>sdf</Card.Section>

        <List></List>

      </Card>
      
    </Layout.Section>
    <Layout.Section>{/* Page-level banners */}</Layout.Section>
    <Layout.Section>{/* Narrow page content */}</Layout.Section>
  </Layout>
</Page>

    </>;
}
