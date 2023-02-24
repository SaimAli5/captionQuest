CREATE TABLE "public.User" (
	"id" serial NOT NULL,
	"username" varchar(50) NOT NULL UNIQUE,
	"password" integer NOT NULL UNIQUE,
	CONSTRAINT "User_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Image" (
	"id" serial NOT NULL,
	"file_name" varchar(80) NOT NULL,
	"url" varchar(2048) NOT NULL UNIQUE,
	CONSTRAINT "Image_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Caption_table" (
	"id" serial NOT NULL,
	"caption" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"image_id" integer NOT NULL,
	CONSTRAINT "Caption_table_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.User_Image" (
	"user_id" integer NOT NULL,
	"image_id" integer NOT NULL
) WITH (
  OIDS=FALSE
);





ALTER TABLE "Caption_table" ADD CONSTRAINT "Caption_table_fk0" FOREIGN KEY ("user_id") REFERENCES "User"("id");
ALTER TABLE "Caption_table" ADD CONSTRAINT "Caption_table_fk1" FOREIGN KEY ("image_id") REFERENCES "Image"("id");

ALTER TABLE "User_Image" ADD CONSTRAINT "User_Image_fk0" FOREIGN KEY ("user_id") REFERENCES "User"("id");
ALTER TABLE "User_Image" ADD CONSTRAINT "User_Image_fk1" FOREIGN KEY ("image_id") REFERENCES "Image"("id");





