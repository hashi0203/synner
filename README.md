# Synner

This Web application is to generate data that looks real.
For demo, check of codes and so on, you may need to generate artificial though realistic data.
This application supports this operation.
This project is based on ["Is this Real? Generating Synthetic Data that Looks Real" by Mannino et al. (UIST 2019)](http://azza.azurewebsites.net/files/Synner-UIST2019.pdf).

# Installation

1. Paste the following commands at a terminal prompt to download this source code.

	```bash
	git clone https://github.com/hashi0203/synner.git
	```
2. Open index.html in your browser.


# Usage

 - Train
	 1. Download datasets and captions.  
		This application uses MSCOCO dataset, and you can download them from following links.  
		The train dataset is for training, the validation dataset is for evaluation, so you can download only what you need.
 
		- [2014 Train images [83K/13GB]](http://images.cocodataset.org/zips/train2014.zip)  
		- [2014 Val images [41K/6GB]](http://images.cocodataset.org/zips/val2014.zip)
		- [2014 Train/Val annotations [241MB]](http://images.cocodataset.org/annotations/annotations_trainval2014.zip)

	2. Place downloaded files under the 'data' directory following the directory tree.
		```bash
		|-- image-captioning
		    |-- data
			    |-- train
				    |-- captions_train2014.json
				    |-- images
					    |-- COCO_train2014_{number}.jpg
					    |-- ..
				|-- val
					|-- captions_val2014.json
				    |-- images
					    |-- COCO_val2014_{number}.jpg
					    |-- ..
		    |-- ..
		``` 

	 3. Set (hyper)parameters in config.py.
		It is also ok if you don't edit anything.

	4. Start training by using the Encoder CNN to change images to feature vectors and the Decoder RNN (LSTM) to change feature vectors to captions.
		```bash
		python3 main.py 'train'
		```
		Ref. It took 6.5 hours to complete with the default parameters by 4 GPUs in NVIDIA TESLA P100(Pascal).  
		Ref. Final loss was 1.9155 in this case.

	5. Model files are save in image-captioning/model if you didn't edit config.py.

- Evaluate
	1. Following 1, 2, 3 in Training section.
	2. Set (hyper)parameters in config.py.
		It is also ok if you don't edit anything, but be sure that the parameters should be the same as when training.
	3. Start evaluating using the BLEU-4 score.
		```bash
		python3 main.py 'eval'
		```
		Ref. It took very long time if you use all images, so I recommend you to save outputs by setting LOG_STEP and stop evaluating when the values are stable. 
		Ref. The Decoder RNN model runs faster if you use it in CPU than GPU.
		Ref. BLEU-4 score by 5000 images was 0.266 in this case.
	4. Output will be shown in stdout and also you can check it in image-captioning/test/test_results.txt.

- Infer
	1. Prepare images which you want to make captions of and place it in image-captioning/test/images.
	2. Set (hyper)parameters in config.py.
		It is also ok if you don't edit anything, but be sure that the parameters should be the same as when training.
	3. Start inferring by beam search.
		```bash
		python3 main.py 'infer'
		```
	4. Output will be shown in stdout and also you can check it in image-captioning/test/infer_results.txt.

# Reference
```bash
@inproceedings{inproceedings,
  author = {Mannino, Miro and Abouzied, Azza},
  year   = {2019},
  month  = {10},
  pages  = {549-561},
  title  = {Is this Real?: Generating Synthetic Data that Looks Real},
  isbn   = {978-1-4503-6816-2},
  doi    = {10.1145/3332165.3347866}
}
```