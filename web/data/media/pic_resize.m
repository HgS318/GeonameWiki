
in_folder = 'D:\MyData\Webs\IDEA\GeonameOneMap\web\data\media\201803\';
out_folder = 'D:\MyData\Webs\IDEA\GeonameOneMap\web\data\media\201803\680\';
fileExt = 'jpg';

width = 680;
% height = 66;

files = dir(fullfile(in_folder, strcat('*.', fileExt)));
len = size(files, 1);
% print (files);
fprintf('%g\n', len);
for i=1:len
    imgName = files(i, 1).name;
	fileName = strcat(in_folder, imgName);
    I=imread(fileName, 'jpg');
    [ho, wo, vo] = size(I);
    height = double(ho) / double(wo) * width;
    B = imresize(I, [height width], 'nearest');
    imwrite(B, strcat(out_folder, imgName), 'Quality', 100);
    fprintf('%s\n', fileName);
end  
