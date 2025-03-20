import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import FormattedText from '../components/FormattedText';

interface FileUploadProps {
  title?: string;
  onFileSelected?: (file: DocumentPickerResponse) => void;
  supportedFormats?: string;
  containerStyle?: object;
  titleStyle?: object;
  uploadAreaStyle?: object;
  textStyle?: object;
  onFileRemoved?: () => void; 
}

const FileUpload: React.FC<FileUploadProps> = ({
  title,
  onFileSelected,
  supportedFormats = 'PDF, JPG, PNG',
  containerStyle,
  titleStyle,
  uploadAreaStyle,
  textStyle,
  onFileRemoved, // Destructured this prop
}) => {
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      setSelectedFile(res);
      if (onFileSelected) {
        onFileSelected(res);
      }
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file picker');
      } else {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null); // Reset selected file
    if (onFileRemoved) {
      onFileRemoved(); // Call the onFileRemoved prop from parent
    }
  };

  return (
    <View style={[styles.uploadContainer, containerStyle]}>
      {title && (
        <FormattedText
          isBold
          fontSize={16}
          color="#333"
          style={[styles.uploadTitle, titleStyle || {}]}
        >
          {title}
        </FormattedText>
      )}

      <View style={[styles.fileUploadArea, uploadAreaStyle]}>
        {selectedFile ? (
          <View style={styles.filePreview}>
            {/* Display image preview if it's an image */}
            {selectedFile.type?.includes('image') ? (
              <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
            ) : (
              <Ionicons name="document-text-outline" size={50} color="#4931BA" />
            )}
            <TouchableOpacity onPress={handleFileRemove} style={styles.deleteIcon}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Wrap the upload icon in TouchableOpacity */}
            <TouchableOpacity onPress={handleFilePick} style={styles.iconContainer}>
              <View style={styles.circularIcon}>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Make sure "Choose file" and "to upload" are inline */}
            <View style={styles.inlineTextContainer}>
              <TouchableOpacity onPress={handleFilePick}>
                <Text style={styles.uploadLink}>Choose file</Text>
              </TouchableOpacity>
              <Text style={styles.uploadText}> to upload</Text>
            </View>

            <Text style={styles.uploadSubtext}>
              Supported formats: {supportedFormats}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  uploadTitle: {
    marginBottom: 10,
  },
  fileUploadArea: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  circularIcon: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#075E54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
  uploadLink: {
    color: '#075E54',
    fontWeight: 'bold',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  filePreview: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  deleteIcon: {
    position: 'absolute',
    top: 35,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  inlineTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FileUpload;
